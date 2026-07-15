import type { BaseProps, Position, Severity } from '@amg-webui/types'

export interface NotificationProps extends BaseProps {
  title?: string
  message?: string
  severity?: Severity
  duration?: number
  closable?: boolean
  position?: Position
  visible?: boolean
}

export interface NotificationEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
}
