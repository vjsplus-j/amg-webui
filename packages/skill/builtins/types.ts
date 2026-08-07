/** Official SR3 built-in skill contracts (framework-agnostic). */

export interface TableSearchConfig {
  keyword?: string
  page?: number
  pageSize?: number
  filters?: Record<string, unknown>
  /** Adapter name that performs the search (default: `search`). */
  adapter?: string
}

export interface TableSearchResult<T = unknown> {
  list: T[]
  total: number
  page: number
  pageSize: number
  keyword: string
}

export interface DictMappingConfig {
  /** Dictionary code / namespace. */
  dict: string
  /** Values to map (codes → labels). */
  values?: Array<string | number>
  /** Adapter name (default: `dict`). */
  adapter?: string
}

export interface DictMappingResult {
  dict: string
  map: Record<string, string>
  labels: string[]
}

export interface FormSubmitConfig {
  formId?: string
  values: Record<string, unknown>
  /** Adapter name (default: `submit`). */
  adapter?: string
  validate?: boolean
}

export interface FormSubmitResult {
  ok: boolean
  id?: string
  values: Record<string, unknown>
}

export interface TableExportConfig {
  rows: unknown[]
  columns?: Array<{ field: string; header?: string }>
  format?: 'csv' | 'json'
  filename?: string
  /** Optional adapter override for host download (default: local serialize). */
  adapter?: string
}

export interface TableExportResult {
  format: 'csv' | 'json'
  filename: string
  content: string
  byteLength: number
}

export interface RequestWrapperConfig {
  /** Adapter name that performs the request (default: `request`). */
  adapter?: string
  input: unknown
  maxAttempts?: number
  delayMs?: number
  backoff?: number
}

export interface RequestWrapperResult<T = unknown> {
  data: T
  attempts: number
}
