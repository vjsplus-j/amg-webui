import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, ref } from 'vue'
import { useBizAsync } from '@amg-webui/components/business'
import type { BizCrudAdapter, BizPageQuery, BizPageResult } from '@amg-webui/components/business'

type Row = { id: number; name: string }

function withHook<T>(factory: () => T): { api: T; dispose: () => void } {
  let api!: T
  const scope = effectScope()
  scope.run(() => {
    api = factory()
  })
  return { api, dispose: () => scope.stop() }
}

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('useBizAsync', () => {
  it('setPagination changes page without resetting to 1', async () => {
    const calls: BizPageQuery[] = []
    const adapter: BizCrudAdapter<Row> = {
      async list(query) {
        calls.push({ ...query, filters: { ...query.filters } })
        return { list: [{ id: query.page, name: `p${query.page}` }], total: 30 }
      }
    }
    const { api, dispose } = withHook(() =>
      useBizAsync({ adapter, immediate: false, keywordDebounceMs: 0 })
    )

    api.setPagination({ page: 3, pageSize: 10 })
    await Promise.resolve()
    await Promise.resolve()

    expect(api.page.value).toBe(3)
    expect(api.pageSize.value).toBe(10)
    expect(calls).toHaveLength(1)
    expect(calls[0]).toMatchObject({ page: 3, pageSize: 10 })

    dispose()
  })

  it('setPagination size change applies page from payload once', async () => {
    const calls: BizPageQuery[] = []
    const adapter: BizCrudAdapter<Row> = {
      async list(query) {
        calls.push({ ...query })
        return { list: [], total: 0 }
      }
    }
    const { api, dispose } = withHook(() =>
      useBizAsync({
        adapter,
        immediate: false,
        keywordDebounceMs: 0,
        initialQuery: { page: 3, pageSize: 10 }
      })
    )

    api.setPagination({ page: 1, pageSize: 20 })
    await Promise.resolve()
    await Promise.resolve()

    expect(api.page.value).toBe(1)
    expect(api.pageSize.value).toBe(20)
    expect(calls).toHaveLength(1)
    expect(calls[0]).toMatchObject({ page: 1, pageSize: 20 })

    dispose()
  })

  it('drops stale list responses (request sequence)', async () => {
    const first = deferred<BizPageResult<Row>>()
    const second = deferred<BizPageResult<Row>>()
    let n = 0
    const adapter: BizCrudAdapter<Row> = {
      list() {
        n += 1
        return n === 1 ? first.promise : second.promise
      }
    }
    const { api, dispose } = withHook(() =>
      useBizAsync({ adapter, immediate: false, keywordDebounceMs: 0 })
    )

    const p1 = api.load()
    const p2 = api.load()
    second.resolve({ list: [{ id: 2, name: 'second' }], total: 1 })
    await p2
    first.resolve({ list: [{ id: 1, name: 'first' }], total: 1 })
    await p1

    expect(api.list.value).toEqual([{ id: 2, name: 'second' }])
    dispose()
  })

  it('debounces keyword search', async () => {
    vi.useFakeTimers()
    const calls: string[] = []
    const adapter: BizCrudAdapter<Row> = {
      async list(query) {
        calls.push(query.keyword ?? '')
        return { list: [], total: 0 }
      }
    }
    const { api, dispose } = withHook(() =>
      useBizAsync({ adapter, immediate: false, keywordDebounceMs: 300 })
    )

    api.setKeyword('a')
    api.setKeyword('ab')
    api.setKeyword('abc')
    expect(calls).toHaveLength(0)

    await vi.advanceTimersByTimeAsync(300)
    expect(calls).toEqual(['abc'])
    expect(api.page.value).toBe(1)

    dispose()
  })

  it('serves cached list until force reload', async () => {
    let hits = 0
    const adapter: BizCrudAdapter<Row> = {
      async list() {
        hits += 1
        return { list: [{ id: hits, name: `n${hits}` }], total: 1 }
      }
    }
    const { api, dispose } = withHook(() =>
      useBizAsync({
        adapter,
        immediate: false,
        keywordDebounceMs: 0,
        cache: { max: 8 }
      })
    )

    await api.load()
    expect(hits).toBe(1)
    expect(api.list.value[0]?.id).toBe(1)

    await api.load()
    expect(hits).toBe(1)
    expect(api.list.value[0]?.id).toBe(1)

    await api.load({ force: true })
    expect(hits).toBe(2)
    expect(api.list.value[0]?.id).toBe(2)

    dispose()
  })

  it('tracks mutation state and supports optimistic remove', async () => {
    const remove = deferred<void>()
    const adapter: BizCrudAdapter<Row> = {
      async list() {
        return {
          list: [
            { id: 1, name: 'a' },
            { id: 2, name: 'b' }
          ],
          total: 2
        }
      },
      remove: () => remove.promise
    }
    const { api, dispose } = withHook(() =>
      useBizAsync({
        adapter,
        immediate: false,
        keywordDebounceMs: 0,
        getItemId: (row) => row.id
      })
    )

    await api.load()
    const pending = api.remove(1, { optimistic: true })
    expect(api.mutating.value).toBe(true)
    expect(api.mutation.value.type).toBe('remove')
    expect(api.list.value.map((r) => r.id)).toEqual([2])
    expect(api.total.value).toBe(1)

    remove.resolve()
    await pending
    expect(api.mutating.value).toBe(false)
    expect(api.mutation.value.type).toBe(null)
    expect(api.list.value.map((r) => r.id)).toEqual([1, 2])

    dispose()
  })

  it('tracks mutation failure and rolls back optimistic remove', async () => {
    const remove = deferred<void>()
    const adapter: BizCrudAdapter<Row> = {
      async list() {
        return {
          list: [
            { id: 1, name: 'a' },
            { id: 2, name: 'b' }
          ],
          total: 2
        }
      },
      remove: () => remove.promise
    }
    const { api, dispose } = withHook(() =>
      useBizAsync({
        adapter,
        immediate: false,
        keywordDebounceMs: 0,
        getItemId: (row) => row.id
      })
    )

    await api.load()
    const pending = api.remove(1, { optimistic: true })
    expect(api.list.value.map((r) => r.id)).toEqual([2])

    remove.reject(new Error('network down'))
    await pending

    expect(api.mutation.value.error).toBe('network down')
    expect(api.list.value.map((r) => r.id)).toEqual([1, 2])
    expect(api.mutating.value).toBe(false)

    dispose()
  })

  it('aborts in-flight mutation when scope disposes', async () => {
    let seenSignal: AbortSignal | undefined
    const adapter: BizCrudAdapter<Row> = {
      async list() {
        return { list: [{ id: 1, name: 'a' }], total: 1 }
      },
      remove(_id, req) {
        seenSignal = req?.signal
        return new Promise<void>((_resolve, reject) => {
          req?.signal?.addEventListener('abort', () => {
            const err = new Error('aborted')
            err.name = 'AbortError'
            reject(err)
          })
        })
      }
    }
    const { api, dispose } = withHook(() =>
      useBizAsync({
        adapter,
        immediate: false,
        keywordDebounceMs: 0,
        getItemId: (row) => row.id
      })
    )

    await api.load()
    const pending = api.remove(1)
    expect(seenSignal).toBeTruthy()
    expect(seenSignal?.aborted).toBe(false)
    dispose()
    expect(seenSignal?.aborted).toBe(true)
    await pending
    expect(api.mutating.value).toBe(false)
  })

  it('reloads when adapter identity changes', async () => {
    const a: BizCrudAdapter<Row> = {
      async list() {
        return { list: [{ id: 1, name: 'a' }], total: 1 }
      }
    }
    const b: BizCrudAdapter<Row> = {
      async list() {
        return { list: [{ id: 2, name: 'b' }], total: 1 }
      }
    }
    const adapterRef = ref(a)
    const { api, dispose } = withHook(() =>
      useBizAsync({
        adapter: () => adapterRef.value,
        immediate: true,
        keywordDebounceMs: 0
      })
    )

    await Promise.resolve()
    await Promise.resolve()
    expect(api.list.value[0]?.name).toBe('a')

    adapterRef.value = b
    await Promise.resolve()
    await Promise.resolve()
    expect(api.list.value[0]?.name).toBe('b')

    dispose()
  })
})
