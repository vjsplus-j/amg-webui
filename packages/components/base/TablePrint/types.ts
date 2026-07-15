import type { BaseProps } from '@amg-webui/types'

export interface TablePrintProps extends BaseProps {
  columns?: { key: string; label?: string }[]
  data?: Record<string, unknown>[]
  title?: string
  disabled?: boolean
}

export interface TablePrintEmits {
  (e: 'print'): void
}
