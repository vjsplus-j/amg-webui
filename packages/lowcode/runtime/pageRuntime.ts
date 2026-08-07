import { reactive, ref, type Reactive, type Ref } from 'vue'
import { getByPath, setByPath } from '../bindings'

export interface PageContext {
  page: Record<string, unknown>
  state: Record<string, unknown>
  form: Record<string, unknown>
  data: Record<string, unknown>
  route: Record<string, unknown>
  user: Record<string, unknown>
  env: Record<string, unknown>
}

export type LowcodeActionType =
  | 'SetState'
  | 'SetValue'
  | 'Navigate'
  | 'OpenDialog'
  | 'CloseDialog'
  | 'CallApi'
  | 'SubmitForm'
  | 'ResetForm'
  | 'ShowMessage'
  | 'Download'
  | 'RefreshData'

export interface LowcodeAction {
  type: LowcodeActionType
  /** Target path for SetState / SetValue / OpenDialog (state key), Download filename, etc. */
  target?: string
  value?: unknown
  /** DataSource id for CallApi / RefreshData / SubmitForm / Download */
  dataSourceId?: string
  /** Navigate path or Download URL */
  path?: string
  message?: string
  severity?: 'info' | 'success' | 'warn' | 'error'
  /** Chained next actions */
  next?: LowcodeAction[]
}

export interface DataSourceDef {
  id: string
  type: 'rest' | 'static' | 'mock'
  name?: string
  request?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    url?: string
    headers?: Record<string, string>
    query?: Record<string, string>
    body?: unknown
  }
  /** Static / mock payload */
  staticData?: unknown
  transform?: 'identity' | 'listTotal'
  /** Path in response → context, e.g. `{ list: 'data.list', total: 'data.total' }` for mapping into data[id] */
  responseMap?: Record<string, string>
  cache?: boolean
  /** Cache TTL in ms when `cache` is true (default: no expiry). */
  cacheTtlMs?: number
  retry?: number
  /** Request timeout in ms (REST only). */
  timeout?: number
}

export interface DataSourceState {
  loading: boolean
  error: string | null
  response: unknown
}

export interface ShowMessagePayload {
  message: string
  severity: 'info' | 'success' | 'warn' | 'error'
}

export interface RunDataSourceOptions {
  /** Bypass cache and re-fetch. */
  force?: boolean
  /** Override request body (SubmitForm). */
  body?: unknown
  /** Override HTTP method (SubmitForm defaults to POST). */
  method?: DataSourceDef['request'] extends infer R ? (R extends { method?: infer M } ? M : never) : never
}

export interface PageRuntimeOptions {
  initial?: Partial<PageContext>
  dataSources?: DataSourceDef[]
  /** Optional navigate hook */
  onNavigate?: (path: string) => void
  onMessage?: (payload: ShowMessagePayload) => void
  /** Trigger browser / host download (defaults to anchor click in browser). */
  onDownload?: (payload: { url: string; filename?: string; blob?: Blob }) => void
  /** Custom fetch for REST (defaults to global fetch) */
  fetchImpl?: typeof fetch
}

export interface PageRuntime {
  context: Reactive<PageContext>
  dataSources: Ref<DataSourceDef[]>
  dsState: Reactive<Record<string, DataSourceState>>
  messages: Ref<ShowMessagePayload[]>
  setState: (path: string, value: unknown) => void
  getState: (path: string) => unknown
  registerDataSource: (ds: DataSourceDef) => void
  runDataSource: (id: string, options?: RunDataSourceOptions) => Promise<unknown>
  invalidateDataSourceCache: (id?: string) => void
  runAction: (action: LowcodeAction) => Promise<void>
  runActionChain: (actions: LowcodeAction[]) => Promise<void>
  /** Resolve `__events` handler name → actions map */
  handlersFromActions: (map: Record<string, LowcodeAction[]>) => Record<string, (...args: unknown[]) => void>
  reset: () => void
}

interface CacheEntry {
  data: unknown
  cachedAt: number
}

function emptyContext(partial?: Partial<PageContext>): PageContext {
  return {
    page: { ...(partial?.page ?? {}) },
    state: { ...(partial?.state ?? {}) },
    form: { ...(partial?.form ?? {}) },
    data: { ...(partial?.data ?? {}) },
    route: { ...(partial?.route ?? {}) },
    user: { ...(partial?.user ?? {}) },
    env: { ...(partial?.env ?? { mode: 'studio' }) }
  }
}

function resolveTemplateString(input: string, ctx: PageContext): string {
  return input.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, path: string) => {
    const v = getByPath(ctx as unknown as Record<string, unknown>, path)
    return v == null ? '' : String(v)
  })
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function defaultDownload(payload: { url: string; filename?: string; blob?: Blob }): void {
  if (typeof document === 'undefined') return
  const anchor = document.createElement('a')
  anchor.style.display = 'none'
  if (payload.blob) {
    anchor.href = URL.createObjectURL(payload.blob)
  } else {
    anchor.href = payload.url
  }
  if (payload.filename) anchor.download = payload.filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  if (payload.blob) URL.revokeObjectURL(anchor.href)
}

function mergeBody(base: unknown, extra: unknown): unknown {
  if (base && typeof base === 'object' && !Array.isArray(base) && extra && typeof extra === 'object' && !Array.isArray(extra)) {
    return { ...(base as Record<string, unknown>), ...(extra as Record<string, unknown>) }
  }
  return extra ?? base
}

export function createPageRuntime(options: PageRuntimeOptions = {}): PageRuntime {
  const context = reactive(emptyContext(options.initial)) as Reactive<PageContext>
  const dataSources = ref<DataSourceDef[]>([...(options.dataSources ?? [])])
  const dsState = reactive<Record<string, DataSourceState>>({}) as Reactive<
    Record<string, DataSourceState>
  >
  const messages = ref<ShowMessagePayload[]>([])
  const fetchImpl = options.fetchImpl ?? (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : undefined)
  const downloadImpl = options.onDownload ?? defaultDownload
  const dsCache = new Map<string, CacheEntry>()

  for (const ds of dataSources.value) {
    dsState[ds.id] = { loading: false, error: null, response: null }
  }

  const setState = (path: string, value: unknown) => {
    setByPath(context as unknown as Record<string, unknown>, path, value)
  }

  const getState = (path: string) => getByPath(context as unknown as Record<string, unknown>, path)

  const registerDataSource = (ds: DataSourceDef) => {
    const idx = dataSources.value.findIndex((d) => d.id === ds.id)
    if (idx >= 0) dataSources.value[idx] = ds
    else dataSources.value = [...dataSources.value, ds]
    if (!dsState[ds.id]) dsState[ds.id] = { loading: false, error: null, response: null }
  }

  const applyTransform = (ds: DataSourceDef, raw: unknown): unknown => {
    if (ds.transform === 'listTotal' && raw && typeof raw === 'object') {
      const obj = raw as Record<string, unknown>
      return {
        list: obj.list ?? obj.data ?? obj.items ?? [],
        total: obj.total ?? obj.count ?? 0
      }
    }
    return raw
  }

  const buildRestUrl = (ds: DataSourceDef): string => {
    let url = resolveTemplateString(ds.request?.url ?? '', context)
    const query = ds.request?.query ?? {}
    const qs = Object.entries(query)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(resolveTemplateString(v, context))}`)
      .join('&')
    if (qs) url += (url.includes('?') ? '&' : '?') + qs
    return url
  }

  const cacheKeyFor = (ds: DataSourceDef, url: string, method: string, body: unknown): string => {
    const bodyKey = body == null ? '' : JSON.stringify(body)
    return `${ds.id}:${method}:${url}:${bodyKey}`
  }

  const readCache = (key: string, ds: DataSourceDef): unknown | undefined => {
    if (!ds.cache) return undefined
    const hit = dsCache.get(key)
    if (!hit) return undefined
    if (ds.cacheTtlMs != null && Date.now() - hit.cachedAt > ds.cacheTtlMs) {
      dsCache.delete(key)
      return undefined
    }
    return hit.data
  }

  const writeCache = (key: string, ds: DataSourceDef, data: unknown) => {
    if (!ds.cache) return
    dsCache.set(key, { data, cachedAt: Date.now() })
  }

  const invalidateDataSourceCache = (id?: string) => {
    if (!id) {
      dsCache.clear()
      return
    }
    for (const key of [...dsCache.keys()]) {
      if (key.startsWith(`${id}:`)) dsCache.delete(key)
    }
  }

  const fetchRest = async (
    ds: DataSourceDef,
    init: { method: string; headers: Record<string, string>; body?: string },
    url: string
  ): Promise<Response> => {
    if (!fetchImpl) throw new Error('fetch unavailable')
    const retries = Math.max(0, ds.retry ?? 0)
    let lastError: unknown
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController()
      const timeoutId =
        ds.timeout != null && ds.timeout > 0
          ? setTimeout(() => controller.abort(), ds.timeout)
          : undefined
      try {
        const res = await fetchImpl(url, {
          method: init.method,
          headers: init.headers,
          body: init.body,
          signal: controller.signal
        })
        if (timeoutId) clearTimeout(timeoutId)
        if (!res.ok) {
          lastError = new Error(`HTTP ${res.status}`)
          if (attempt < retries) {
            await sleep(150 * (attempt + 1))
            continue
          }
          throw lastError
        }
        return res
      } catch (e) {
        if (timeoutId) clearTimeout(timeoutId)
        if (e instanceof Error && e.name === 'AbortError') {
          lastError = new Error(ds.timeout ? `Timeout after ${ds.timeout}ms` : 'Aborted')
        } else {
          lastError = e
        }
        if (attempt < retries) {
          await sleep(150 * (attempt + 1))
          continue
        }
        throw lastError
      }
    }
    throw lastError ?? new Error('Request failed')
  }

  const commitDataSourceResult = (ds: DataSourceDef, transformed: unknown) => {
    const st = dsState[ds.id] ?? (dsState[ds.id] = { loading: false, error: null, response: null })
    st.response = transformed
    context.data[ds.id] = transformed
    if (ds.responseMap && transformed && typeof transformed === 'object') {
      for (const [from, toPath] of Object.entries(ds.responseMap)) {
        const val = getByPath(transformed as Record<string, unknown>, from)
        setByPath(context as unknown as Record<string, unknown>, toPath, val)
      }
    }
    return transformed
  }

  const runDataSource = async (id: string, runOptions: RunDataSourceOptions = {}): Promise<unknown> => {
    const ds = dataSources.value.find((d) => d.id === id)
    if (!ds) throw new Error(`Unknown dataSource: ${id}`)
    const st = dsState[id] ?? (dsState[id] = { loading: false, error: null, response: null })
    st.loading = true
    st.error = null
    try {
      let raw: unknown
      if (ds.type === 'static' || ds.type === 'mock') {
        const cacheKey = cacheKeyFor(ds, ds.type, 'READ', null)
        if (!runOptions.force) {
          const cached = readCache(cacheKey, ds)
          if (cached !== undefined) {
            st.response = cached
            context.data[id] = cached
            return cached
          }
        }
        raw = ds.staticData ?? []
        if (ds.type === 'mock') await sleep(80)
        else await Promise.resolve()
        const transformed = applyTransform(ds, raw)
        writeCache(cacheKey, ds, transformed)
        return commitDataSourceResult(ds, transformed)
      }

      const method = (runOptions.method ?? ds.request?.method ?? 'GET').toUpperCase()
      const url = buildRestUrl(ds)
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      for (const [k, v] of Object.entries(ds.request?.headers ?? {})) {
        headers[k] = resolveTemplateString(v, context)
      }
      const bodyPayload = mergeBody(ds.request?.body, runOptions.body)
      const hasBody = method !== 'GET' && method !== 'DELETE'
      const body = hasBody ? JSON.stringify(bodyPayload ?? {}) : undefined
      const cacheKey = cacheKeyFor(ds, url, method, bodyPayload)

      if (!runOptions.force && method === 'GET') {
        const cached = readCache(cacheKey, ds)
        if (cached !== undefined) {
          st.response = cached
          context.data[id] = cached
          return cached
        }
      }

      const res = await fetchRest(ds, { method, headers, body }, url)
      const contentType = res.headers.get('content-type') ?? ''
      if (contentType.includes('application/json')) {
        raw = await res.json()
      } else {
        raw = await res.text()
      }
      const transformed = applyTransform(ds, raw)
      if (!runOptions.force && method === 'GET') writeCache(cacheKey, ds, transformed)
      return commitDataSourceResult(ds, transformed)
    } catch (e) {
      st.error = e instanceof Error ? e.message : String(e)
      throw e
    } finally {
      st.loading = false
    }
  }

  const triggerDownload = async (action: LowcodeAction): Promise<void> => {
    const filename =
      (typeof action.target === 'string' && action.target) ||
      (typeof action.value === 'string' && action.value) ||
      undefined

    if (action.dataSourceId) {
      const result = await runDataSource(action.dataSourceId, { force: true })
      const blob =
        result instanceof Blob
          ? result
          : new Blob([typeof result === 'string' ? result : JSON.stringify(result, null, 2)], {
              type: 'application/json'
            })
      downloadImpl({ url: '', filename: filename ?? `${action.dataSourceId}.json`, blob })
      return
    }

    const url = resolveTemplateString(action.path ?? '', context)
    if (!url) throw new Error('Download requires path or dataSourceId')
    if (!fetchImpl) throw new Error('fetch unavailable')

    const res = await fetchImpl(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    downloadImpl({ url, filename, blob })
  }

  const runAction = async (action: LowcodeAction): Promise<void> => {
    switch (action.type) {
      case 'SetState':
      case 'SetValue':
        if (action.target) setState(action.target, action.value)
        break
      case 'Navigate':
        if (action.path) options.onNavigate?.(action.path)
        break
      case 'OpenDialog':
        if (action.target) setState(action.target, true)
        break
      case 'CloseDialog':
        if (action.target) setState(action.target, false)
        break
      case 'CallApi':
        if (action.dataSourceId) await runDataSource(action.dataSourceId)
        break
      case 'RefreshData':
        if (action.dataSourceId) {
          invalidateDataSourceCache(action.dataSourceId)
          await runDataSource(action.dataSourceId, { force: true })
        }
        break
      case 'SubmitForm':
        if (action.dataSourceId) {
          await runDataSource(action.dataSourceId, {
            method: 'POST',
            body: { ...context.form },
            force: true
          })
        }
        break
      case 'ResetForm':
        context.form = {}
        break
      case 'ShowMessage': {
        const payload: ShowMessagePayload = {
          message: action.message ?? '',
          severity: action.severity ?? 'info'
        }
        messages.value = [...messages.value, payload]
        options.onMessage?.(payload)
        break
      }
      case 'Download':
        await triggerDownload(action)
        break
      default:
        break
    }
    if (action.next?.length) await runActionChain(action.next)
  }

  const runActionChain = async (actions: LowcodeAction[]) => {
    for (const a of actions) await runAction(a)
  }

  const handlersFromActions = (map: Record<string, LowcodeAction[]>) => {
    const handlers: Record<string, (...args: unknown[]) => void> = {}
    for (const [name, actions] of Object.entries(map)) {
      handlers[name] = () => {
        void runActionChain(actions)
      }
    }
    return handlers
  }

  const reset = () => {
    Object.assign(context, emptyContext(options.initial))
    messages.value = []
    dsCache.clear()
  }

  return {
    context,
    dataSources,
    dsState,
    messages,
    setState,
    getState,
    registerDataSource,
    runDataSource,
    invalidateDataSourceCache,
    runAction,
    runActionChain,
    handlersFromActions,
    reset
  }
}
