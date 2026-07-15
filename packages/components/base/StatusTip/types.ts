import type { BaseProps, Severity } from '@amg-webui/types'

export interface StatusTipProps extends BaseProps {
  message?: string
  severity?: Severity
  closable?: boolean
}

export interface StatusTipEmits {
  (e: 'close'): void
}
