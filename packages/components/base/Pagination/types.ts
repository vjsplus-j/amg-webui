import type { BaseProps } from '@amg-webui/types'

export interface PaginationProps extends BaseProps {
  total?: number
  page?: number
  pageSize?: number
  pageSizes?: number[]
  disabled?: boolean
}

export interface PaginationEmits {
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'change', payload: { page: number; pageSize: number }): void
}
