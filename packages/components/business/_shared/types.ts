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

export interface BizAsyncState {
  loading: boolean
  error: string | null
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
 */
export interface BizCrudAdapter<T, TCreate = Partial<T>, TUpdate = T> {
  list(query: BizPageQuery): Promise<BizPageResult<T>>
  get?(id: string | number): Promise<T | null>
  create?(payload: TCreate): Promise<T>
  update?(payload: TUpdate): Promise<T>
  remove?(id: string | number): Promise<void>
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
