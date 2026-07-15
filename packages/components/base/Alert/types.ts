import type { BaseProps } from '@amg-webui/types'
import type { Severity } from '@amg-webui/types'

export type AlertSeverity = 'success' | 'warning' | 'error' | 'info' | Severity

export interface AlertProps extends BaseProps {
  title?: string
  severity?: AlertSeverity
  closable?: boolean
  showIcon?: boolean
}

export interface AlertEmits {
  (e: 'close'): void
}
