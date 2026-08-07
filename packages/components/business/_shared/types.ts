/**
 * Shared business-module contract (LIBRARY_PLAN P3).
 * Domains may use controlled props+emits and/or an optional adapter.
 */

export interface BizPageQuery {
  page: number
  pageSize: number
  keyword?: string
  /** Extra filter axes (role, status, category, …) */
  filters?: Record<string, string | number | boolean | null | undefined>
}

export interface BizPageResult<T> {
  list: T[]
  total: number
}

/** Optional request context (abort) for adapter methods. */
export interface BizRequestOptions {
  signal?: AbortSignal
}

export interface BizAsyncState {
  loading: boolean
  error: string | null
}

export interface BizMutationState {
  pending: boolean
  error: string | null
  type: 'create' | 'update' | 'remove' | null
}

/** UI-level access gates — not a real ACL engine. */
export interface BizAccess {
  create?: boolean
  update?: boolean
  delete?: boolean
  view?: boolean
  refresh?: boolean
  /** Domain extras: refund, batch, publish, … */
  [action: string]: boolean | undefined
}

export const DEFAULT_BIZ_ACCESS: Required<
  Pick<BizAccess, 'create' | 'update' | 'delete' | 'view' | 'refresh'>
> = {
  create: true,
  update: true,
  delete: true,
  view: true,
  refresh: true
}

/**
 * Host-owned data adapter. Components never hard-code HTTP.
 * When omitted, domains stay on controlled props + emits.
 *
 * `options.signal` is optional — hosts that ignore it still work;
 * `useBizAsync` always applies request sequencing so stale responses are dropped.
 */
export interface BizCrudAdapter<T, TCreate = Partial<T>, TUpdate = T> {
  list(query: BizPageQuery, options?: BizRequestOptions): Promise<BizPageResult<T>>
  get?(id: string | number, options?: BizRequestOptions): Promise<T | null>
  create?(payload: TCreate, options?: BizRequestOptions): Promise<T>
  update?(payload: TUpdate, options?: BizRequestOptions): Promise<T>
  remove?(id: string | number, options?: BizRequestOptions): Promise<void>
}

/** Standard named slots for page-grade kits (P3 slotized闭环). */
export const BIZ_SLOT_NAMES = [
  'toolbar',
  'filters',
  'table',
  'list',
  'detail',
  'empty',
  'error',
  'loading',
  'actions'
] as const

export type BizSlotName = (typeof BIZ_SLOT_NAMES)[number]
