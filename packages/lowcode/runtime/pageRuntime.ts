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
  /** Target path for SetState / SetValue / OpenDialog (state key), etc. */
  target?: string
  value?: unknown
  /** DataSource id for CallApi / RefreshData */
  dataSourceId?: string
  /** Navigate path */
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
  retry?: number
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

export interface PageRuntimeOptions {
  initial?: Partial<PageContext>
  dataSources?: DataSourceDef[]
  /** Optional navigate hook */
  onNavigate?: (path: string) => void
  onMessage?: (payload: ShowMessagePayload) => void
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
  runDataSource: (id: string) => Promise<unknown>
  runAction: (action: LowcodeAction) => Promise<void>
  runActionChain: (actions: LowcodeAction[]) => Promise<void>
  /** Resolve `__events` handler name → actions map */
  handlersFromActions: (map: Record<string, LowcodeAction[]>) => Record<string, (...args: unknown[]) => void>
  reset: () => void
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

export function createPageRuntime(options: PageRuntimeOptions = {}): PageRuntime {
  const context = reactive(emptyContext(options.initial)) as Reactive<PageContext>
  const dataSources = ref<DataSourceDef[]>([...(options.dataSources ?? [])])
  const dsState = reactive<Record<string, DataSourceState>>({}) as Reactive<
    Record<string, DataSourceState>
  >
  const messages = ref<ShowMessagePayload[]>([])
  const fetchImpl = options.fetchImpl ?? (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : undefined)

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

  const runDataSource = async (id: string): Promise<unknown> => {
    const ds = dataSources.value.find((d) => d.id === id)
    if (!ds) throw new Error(`Unknown dataSource: ${id}`)
    const st = dsState[id] ?? (dsState[id] = { loading: false, error: null, response: null })
    st.loading = true
    st.error = null
    try {
      let raw: unknown
      if (ds.type === 'static' || ds.type === 'mock') {
        raw = ds.staticData ?? []
        // Simulate async
        await Promise.resolve()
      } else {
        if (!fetchImpl) throw new Error('fetch unavailable')
        const method = ds.request?.method ?? 'GET'
        let url = resolveTemplateString(ds.request?.url ?? '', context)
        const query = ds.request?.query ?? {}
        const qs = Object.entries(query)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(resolveTemplateString(v, context))}`)
          .join('&')
        if (qs) url += (url.includes('?') ? '&' : '?') + qs
        const headers: Record<string, string> = {}
        for (const [k, v] of Object.entries(ds.request?.headers ?? {})) {
          headers[k] = resolveTemplateString(v, context)
        }
        const res = await fetchImpl(url, {
          method,
          headers,
          body:
            method === 'GET' || method === 'DELETE'
              ? undefined
              : JSON.stringify(ds.request?.body ?? {})
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        raw = await res.json()
      }
      const transformed = applyTransform(ds, raw)
      st.response = transformed
      context.data[id] = transformed
      if (ds.responseMap && transformed && typeof transformed === 'object') {
        for (const [from, toPath] of Object.entries(ds.responseMap)) {
          const val = getByPath(transformed as Record<string, unknown>, from)
          setByPath(context as unknown as Record<string, unknown>, toPath, val)
        }
      }
      return transformed
    } catch (e) {
      st.error = e instanceof Error ? e.message : String(e)
      throw e
    } finally {
      st.loading = false
    }
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
      case 'RefreshData':
        if (action.dataSourceId) await runDataSource(action.dataSourceId)
        break
      case 'SubmitForm':
        // no-op hook: consumers listen via onChange on form
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
    runAction,
    runActionChain,
    handlersFromActions,
    reset
  }
}
