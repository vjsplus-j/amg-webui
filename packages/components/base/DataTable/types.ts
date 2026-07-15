import { BaseProps } from '@amg-webui/types'

export type SortOrder = 'asc' | 'desc' | null

export interface Column<T = any> {
  field: string
  header: string
  sortable?: boolean
  filter?: boolean
  style?: Record<string, string>
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T) => string | any | null
}

export interface DataTableProps<T = any> extends BaseProps {
  value?: T[]
  columns: Column<T>[]
  selectionMode?: 'single' | 'multiple'
  paginator?: boolean
  rows?: number
  first?: number
  totalRecords?: number
  sortField?: string
  sortOrder?: SortOrder
  striped?: boolean
  fixedHeader?: boolean
  filterGlobal?: boolean
  loading?: boolean
}

export interface DataTableEmits<T = any> {
  (e: 'update:value', value: T[]): void
  (e: 'update:sortField', field: string): void
  (e: 'update:sortOrder', order: SortOrder): void
  (e: 'update:first', first: number): void
  (e: 'update:rows', rows: number): void
  (e: 'sort', event: { field: string; order: SortOrder }): void
  (e: 'row-select', event: { originalEvent: MouseEvent; data: T; checked: boolean }): void
  (e: 'row-click', event: { originalEvent: MouseEvent; data: T }): void
  (e: 'page', event: { first: number; rows: number; page: number; pageCount: number }): void
}