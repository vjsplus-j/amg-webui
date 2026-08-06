import { ref, type Ref } from 'vue'
import type { BizAsyncState, BizCrudAdapter, BizPageQuery, BizPageResult } from './types'

export interface UseBizAsyncOptions<T, TCreate, TUpdate> {
  adapter: BizCrudAdapter<T, TCreate, TUpdate>
  initialQuery?: Partial<BizPageQuery>
  immediate?: boolean
}

export interface UseBizAsyncReturn<T> {
  list: Ref<T[]>
  total: Ref<number>
  page: Ref<number>
  pageSize: Ref<number>
  keyword: Ref<string>
  filters: Ref<Record<string, string | number | boolean | null | undefined>>
  loading: Ref<boolean>
  error: Ref<string | null>
  state: Ref<BizAsyncState>
  query: () => BizPageQuery
  load: () => Promise<void>
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setKeyword: (keyword: string) => void
  setFilter: (key: string, value: string | number | boolean | null | undefined) => void
}

function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Unknown error'
}

/**
 * Owns loading / error / pagination when a BizCrudAdapter is provided.
 */
export function useBizAsync<T, TCreate = Partial<T>, TUpdate = T>(
  options: UseBizAsyncOptions<T, TCreate, TUpdate>
): UseBizAsyncReturn<T> {
  const list = ref<T[]>([]) as Ref<T[]>
  const total = ref(0)
  const page = ref(options.initialQuery?.page ?? 1)
  const pageSize = ref(options.initialQuery?.pageSize ?? 10)
  const keyword = ref(options.initialQuery?.keyword ?? '')
  const filters = ref<Record<string, string | number | boolean | null | undefined>>({
    ...(options.initialQuery?.filters ?? {})
  })
  const loading = ref(false)
  const error = ref<string | null>(null)
  const state = ref<BizAsyncState>({ loading: false, error: null })

  function syncState() {
    state.value = { loading: loading.value, error: error.value }
  }

  function query(): BizPageQuery {
    return {
      page: page.value,
      pageSize: pageSize.value,
      keyword: keyword.value || undefined,
      filters: { ...filters.value }
    }
  }

  async function load(): Promise<void> {
    loading.value = true
    error.value = null
    syncState()
    try {
      const result: BizPageResult<T> = await options.adapter.list(query())
      list.value = result.list
      total.value = result.total
    } catch (err) {
      error.value = toErrorMessage(err)
      list.value = []
      total.value = 0
    } finally {
      loading.value = false
      syncState()
    }
  }

  function setPage(next: number) {
    page.value = Math.max(1, next)
    void load()
  }

  function setPageSize(size: number) {
    pageSize.value = Math.max(1, size)
    page.value = 1
    void load()
  }

  function setKeyword(next: string) {
    keyword.value = next
    page.value = 1
    void load()
  }

  function setFilter(key: string, value: string | number | boolean | null | undefined) {
    filters.value = { ...filters.value, [key]: value }
    page.value = 1
    void load()
  }

  if (options.immediate !== false) {
    void load()
  }

  return {
    list,
    total,
    page,
    pageSize,
    keyword,
    filters,
    loading,
    error,
    state,
    query,
    load,
    setPage,
    setPageSize,
    setKeyword,
    setFilter
  }
}
