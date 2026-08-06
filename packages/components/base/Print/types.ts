import type { BaseProps } from '@amg-webui/types'

export interface PrintProps extends BaseProps {
  modelValue?: boolean
  title?: string
  disabled?: boolean
  showToolbar?: boolean
  /** CSS class injected into print window body */
  printClass?: string
  copyStyles?: boolean
  pageStyle?: string
  autoClose?: boolean
  windowFeatures?: string
  pendingLabel?: string
}

export interface PrintEmits {
  (e: 'update:modelValue', printing: boolean): void
  (e: 'print'): void
  (e: 'before-print'): void
  (e: 'after-print'): void
  (e: 'error', error: Error): void
}
