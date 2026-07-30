import type { BaseProps } from '@amg-webui/types'

export interface PrintProps extends BaseProps {
  title?: string
  disabled?: boolean
  showToolbar?: boolean
  /** CSS class injected into print window body */
  printClass?: string
}

export interface PrintEmits {
  (e: 'print'): void
  (e: 'before-print'): void
  (e: 'after-print'): void
}
