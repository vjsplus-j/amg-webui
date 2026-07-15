import type { BaseProps, Position, Severity } from '@amg-webui/types'

export interface ToastProps extends BaseProps {
  visible?: boolean
  title?: string
  message?: string
  severity?: Severity
  duration?: number
  closable?: boolean
  position?: Position
}

export interface ToastEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
}
