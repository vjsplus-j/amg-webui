import {
  onScopeDispose,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref
} from 'vue'
import type {
  BizAsyncState,
  BizCrudAdapter,
  BizMutationState,
  BizPageQuery,
  BizPageResult,
  BizRequestOptions
} from './types'

export interface UseBizAsyncCacheOptions {
  /** Max cached list queries (default 32). */
  max?: number
  /** Time-to-live in ms; omit / 0 = no TTL expiry. */
  ttlMs?: number
}

export interface UseBizAsyncOptions<T, TCreate, TUpdate> {
  /** Adapter may be a ref/getter so hosts can swap stores at runtime. */
  adapter: MaybeRefOrGetter<BizCrudAdapter<T, TCreate, TUpdate>>
  initialQuery?: Partial<BizPageQuery>
  immediate?: boolean
  /** Debounce keyword → list (ms). Default 300; `0` = immediate. */
  keywordDebounceMs?: number
  /** In-memory list cache keyed by serialized query. */
  cache?: boolean | UseBizAsyncCacheOptions
  /** Resolve row id for optimistic remove/update (default: `item.id`). */
  getItemId?: (item: T) => string | number
}

export interface BizMutationOptions<T> {
  optimistic?: T | boolean
}

export interface UseBizAsyncReturn<T, TCreate = Partial<T>, TUpdate = T> {
  list: Ref<T[]>
  total: Ref<number>
  page: Ref<number>
  pageSize: Ref<number>
  keyword: Ref<string>
  filters: Ref<Record<string, string | number | boolean | null | undefined>>
  loading: Ref<boolean>
  error: Ref<string | null>
  state: Ref<BizAsyncState>
  mutating: Ref<boolean>
  mutation: Ref<BizMutationState>
  query: () => BizPageQuery
  load: (opts?: { force?: boolean }) => Promise<void>
  abort: () => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  /** Atomic page + pageSize apply — avoids double load / accidental page reset. */
  setPagination: (payload: { page: number; pageSize: number }) => void
  setKeyword: (keyword: string, opts?: { immediate?: boolean }) => void
  setFilter: (key: string, value: string | number | boolean | null | undefined) => void
  create: (payload: TCreate, opts?: BizMutationOptions<T>) => Promise<T | undefined>
  update: (payload: TUpdate, opts?: BizMutationOptions<T>) => Promise<T | undefined>
  remove: (id: string | number, opts?: BizMutationOptions<T>) => Promise<void>
  invalidateCache: () => void
  clearCache: () => void
}

interface CacheEntry<T> {
  result: BizPageResult<T>
  at: number
}

function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Unknown error'
}

function isAbortError(err: unknown): boolean {
  if (err instanceof DOMException && err.name === 'AbortError') return true
  if (err instanceof Error && err.name === 'AbortError') return true
  return false
}

function defaultItemId<T>(item: T): string | number {
  if (item && typeof item === 'object' && 'id' in item) {
    const id = (item as { id: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  throw new Error('useBizAsync: provide getItemId for optimistic updates')
}

function serializeQuery(q: BizPageQuery): string {
  const filters = q.filters
    ? Object.keys(q.filters)
        .sort()
        .reduce<Record<string, string | number | boolean | null | undefined>>((acc, key) => {
          acc[key] = q.filters![key]
          return acc
        }, {})
    : undefined
  return JSON.stringify({
    page: q.page,
    pageSize: q.pageSize,
    keyword: q.keyword ?? '',
    filters: filters ?? {}
  })
}

/**
 * Owns loading / error / pagination / mutations when a BizCrudAdapter is provided.
 * Guards list races via AbortController + request sequence; keyword search is debounced.
 */
export function useBizAsync<T, TCreate = Partial<T>, TUpdate = T>(
  options: UseBizAsyncOptions<T, TCreate, TUpdate>
): UseBizAsyncReturn<T, TCreate, TUpdate> {
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
  const mutating = ref(false)
  const mutation = ref<BizMutationState>({ pending: false, error: null, type: null })

  const keywordDebounceMs = options.keywordDebounceMs ?? 300
  const cacheEnabled = Boolean(options.cache)
  const cacheMax =
    typeof options.cache === 'object' && options.cache.max != null ? options.cache.max : 32
  const cacheTtlMs =
    typeof options.cache === 'object' && options.cache.ttlMs != null ? options.cache.ttlMs : 0
  const resolveId = options.getItemId ?? defaultItemId

  const cache = new Map<string, CacheEntry<T>>()
  let listSeq = 0
  let listController: AbortController | null = null
  let keywordTimer: ReturnType<typeof setTimeout> | null = null
  let disposed = false

  function syncState() {
    state.value = { loading: loading.value, error: error.value }
  }

  function syncMutation(partial: Partial<BizMutationState>) {
    mutation.value = {
      pending: partial.pending ?? mutation.value.pending,
      error: partial.error !== undefined ? partial.error : mutation.value.error,
      type: partial.type !== undefined ? partial.type : mutation.value.type
    }
    mutating.value = mutation.value.pending
  }

  function resolveAdapter(): BizCrudAdapter<T, TCreate, TUpdate> {
    return toValue(options.adapter)
  }

  function query(): BizPageQuery {
    return {
      page: page.value,
      pageSize: pageSize.value,
      keyword: keyword.value || undefined,
      filters: { ...filters.value }
    }
  }

  function abort() {
    if (listController) {
      listController.abort()
      listController = null
    }
  }

  function clearKeywordTimer() {
    if (keywordTimer != null) {
      clearTimeout(keywordTimer)
      keywordTimer = null
    }
  }

  function readCache(key: string): BizPageResult<T> | null {
    if (!cacheEnabled) return null
    const hit = cache.get(key)
    if (!hit) return null
    if (cacheTtlMs > 0 && Date.now() - hit.at > cacheTtlMs) {
      cache.delete(key)
      return null
    }
    // LRU touch
    cache.delete(key)
    cache.set(key, hit)
    return hit.result
  }

  function writeCache(key: string, result: BizPageResult<T>) {
    if (!cacheEnabled) return
    if (cache.has(key)) cache.delete(key)
    cache.set(key, { result, at: Date.now() })
    while (cache.size > cacheMax) {
      const oldest = cache.keys().next().value
      if (oldest == null) break
      cache.delete(oldest)
    }
  }

  function clearCache() {
    cache.clear()
  }

  function invalidateCache() {
    clearCache()
  }

  async function load(opts?: { force?: boolean }): Promise<void> {
    if (disposed) return
    clearKeywordTimer()
    const q = query()
    const key = serializeQuery(q)

    if (!opts?.force) {
      const cached = readCache(key)
      if (cached) {
        list.value = cached.list
        total.value = cached.total
        error.value = null
        loading.value = false
        syncState()
        return
      }
    }

    abort()
    const seq = ++listSeq
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
    listController = controller
    const reqOpts: BizRequestOptions | undefined = controller
      ? { signal: controller.signal }
      : undefined

    loading.value = true
    error.value = null
    syncState()

    try {
      const result = await resolveAdapter().list(q, reqOpts)
      if (disposed || seq !== listSeq) return
      list.value = result.list
      total.value = result.total
      writeCache(key, result)
    } catch (err) {
      if (disposed || seq !== listSeq || isAbortError(err)) return
      error.value = toErrorMessage(err)
      list.value = []
      total.value = 0
    } finally {
      if (seq === listSeq) {
        loading.value = false
        if (listController === controller) listController = null
        syncState()
      }
    }
  }

  function scheduleLoad() {
    void load()
  }

  function setPage(next: number) {
    const clamped = Math.max(1, next)
    if (clamped === page.value) return
    page.value = clamped
    scheduleLoad()
  }

  function setPageSize(size: number) {
    const next = Math.max(1, size)
    if (next === pageSize.value) {
      return
    }
    pageSize.value = next
    page.value = 1
    scheduleLoad()
  }

  function setPagination(payload: { page: number; pageSize: number }) {
    const nextSize = Math.max(1, payload.pageSize)
    const sizeChanged = nextSize !== pageSize.value
    const nextPage = Math.max(1, sizeChanged ? payload.page || 1 : payload.page)
    const pageChanged = nextPage !== page.value

    if (!sizeChanged && !pageChanged) return

    pageSize.value = nextSize
    page.value = nextPage
    scheduleLoad()
  }

  function setKeyword(next: string, opts?: { immediate?: boolean }) {
    keyword.value = next
    page.value = 1
    clearKeywordTimer()
    const immediate = opts?.immediate === true || keywordDebounceMs <= 0
    if (immediate) {
      scheduleLoad()
      return
    }
    keywordTimer = setTimeout(() => {
      keywordTimer = null
      scheduleLoad()
    }, keywordDebounceMs)
  }

  function setFilter(key: string, value: string | number | boolean | null | undefined) {
    filters.value = { ...filters.value, [key]: value }
    page.value = 1
    scheduleLoad()
  }

  async function runMutation<R>(
    type: BizMutationState['type'],
    run: (req: BizRequestOptions | undefined) => Promise<R>,
    rollback?: () => void
  ): Promise<R | undefined> {
    if (disposed) return undefined
    syncMutation({ pending: true, error: null, type })
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
    const reqOpts: BizRequestOptions | undefined = controller
      ? { signal: controller.signal }
      : undefined
    try {
      const result = await run(reqOpts)
      invalidateCache()
      await load({ force: true })
      syncMutation({ pending: false, error: null, type: null })
      return result
    } catch (err) {
      if (!isAbortError(err)) {
        rollback?.()
        syncMutation({ pending: false, error: toErrorMessage(err), type })
      } else {
        syncMutation({ pending: false, error: null, type: null })
      }
      return undefined
    }
  }

  async function create(
    payload: TCreate,
    opts?: BizMutationOptions<T>
  ): Promise<T | undefined> {
    const adapter = resolveAdapter()
    if (!adapter.create) {
      syncMutation({ pending: false, error: 'create is not supported', type: 'create' })
      return undefined
    }
    let snapshot: { list: T[]; total: number } | null = null
    if (opts?.optimistic && typeof opts.optimistic !== 'boolean') {
      snapshot = { list: [...list.value], total: total.value }
      list.value = [opts.optimistic, ...list.value]
      total.value = total.value + 1
    }
    return runMutation(
      'create',
      (req) => adapter.create!(payload, req),
      snapshot
        ? () => {
            list.value = snapshot!.list
            total.value = snapshot!.total
          }
        : undefined
    )
  }

  async function update(
    payload: TUpdate,
    opts?: BizMutationOptions<T>
  ): Promise<T | undefined> {
    const adapter = resolveAdapter()
    if (!adapter.update) {
      syncMutation({ pending: false, error: 'update is not supported', type: 'update' })
      return undefined
    }
    let snapshot: { list: T[]; total: number } | null = null
    if (opts?.optimistic && typeof opts.optimistic !== 'boolean') {
      const id = resolveId(opts.optimistic)
      snapshot = { list: [...list.value], total: total.value }
      list.value = list.value.map((row) => (resolveId(row) === id ? opts.optimistic as T : row))
    }
    return runMutation(
      'update',
      (req) => adapter.update!(payload, req),
      snapshot
        ? () => {
            list.value = snapshot!.list
            total.value = snapshot!.total
          }
        : undefined
    )
  }

  async function remove(id: string | number, opts?: BizMutationOptions<T>): Promise<void> {
    const adapter = resolveAdapter()
    if (!adapter.remove) {
      syncMutation({ pending: false, error: 'remove is not supported', type: 'remove' })
      return
    }
    let snapshot: { list: T[]; total: number } | null = null
    if (opts?.optimistic) {
      snapshot = { list: [...list.value], total: total.value }
      list.value = list.value.filter((row) => resolveId(row) !== id)
      total.value = Math.max(0, total.value - 1)
    }
    await runMutation(
      'remove',
      (req) => adapter.remove!(id, req),
      snapshot
        ? () => {
            list.value = snapshot!.list
            total.value = snapshot!.total
          }
        : undefined
    )
  }

  watch(
    () => toValue(options.adapter),
    (next, prev) => {
      if (next === prev) return
      clearCache()
      abort()
      void load({ force: true })
    }
  )

  if (options.immediate !== false) {
    void load()
  }

  onScopeDispose(() => {
    disposed = true
    clearKeywordTimer()
    abort()
  })

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
    mutating,
    mutation,
    query,
    load,
    abort,
    setPage,
    setPageSize,
    setPagination,
    setKeyword,
    setFilter,
    create,
    update,
    remove,
    invalidateCache,
    clearCache
  }
}
