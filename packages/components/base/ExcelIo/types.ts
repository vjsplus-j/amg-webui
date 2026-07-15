import type { BaseProps } from '@amg-webui/types'

export interface ExcelIoProps extends BaseProps {
  columns?: string[]
  data?: Record<string, unknown>[]
  filename?: string
  disabled?: boolean
}

export interface ExcelIoEmits {
  (e: 'import', rows: Record<string, string>[]): void
  (e: 'export'): void
}
