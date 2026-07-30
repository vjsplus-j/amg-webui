import type { BaseProps } from '@amg-webui/types'

export interface TablePrintProps extends BaseProps {
  columns?: { key: string; label?: string }[]
  data?: Record<string, unknown>[]
  title?: string
  disabled?: boolean
  bordered?: boolean
}

export interface TablePrintEmits {
  (e: 'print'): void
  (e: 'before-print'): void
  (e: 'after-print'): void
}
