import { describe, expect, it } from 'vitest'
import { effectScope } from 'vue'
import { useBizAuth } from '@amg-webui/components/business'
import type { BizAuthAdapter, BizLoginCredentials } from '@amg-webui/components/business'

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
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

describe('useBizAuth', () => {
  it('drops stale login responses (request sequence)', async () => {
    const first = deferred<{ token: string }>()
    const second = deferred<{ token: string }>()
    let n = 0
    const adapter: BizAuthAdapter = {
      login() {
        n += 1
        return n === 1 ? first.promise : second.promise
      }
    }
    const { api, dispose } = withHook(() => useBizAuth({ adapter: () => adapter }))
    const creds: BizLoginCredentials = { username: 'admin', password: 'secret' }

    const p1 = api.login(creds)
    const p2 = api.login(creds)
    second.resolve({ token: 'second' })
    await p2
    first.resolve({ token: 'first' })
    await p1

    expect(api.error.value).toBeNull()
    dispose()
  })

  it('forwards AbortSignal to adapter login', async () => {
    let seenSignal: AbortSignal | undefined
    const adapter: BizAuthAdapter = {
      login(_creds, req) {
        seenSignal = req?.signal
        return new Promise((_resolve, reject) => {
          req?.signal?.addEventListener('abort', () => {
            const err = new Error('aborted')
            err.name = 'AbortError'
            reject(err)
          })
        })
      }
    }
    const { api, dispose } = withHook(() => useBizAuth({ adapter: () => adapter }))
    const pending = api.login({ username: 'a', password: 'b' })
    expect(seenSignal).toBeTruthy()
    expect(seenSignal?.aborted).toBe(false)
    api.abort()
    expect(seenSignal?.aborted).toBe(true)
    await pending
    dispose()
  })
})
