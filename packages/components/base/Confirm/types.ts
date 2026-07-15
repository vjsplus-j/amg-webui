import type { BaseProps, Severity } from '@amg-webui/types'

export interface ConfirmProps extends BaseProps {
  visible?: boolean
  title?: string
  message?: string
  closable?: boolean
  dismissible?: boolean
  confirmLabel?: string
  cancelLabel?: string
  severity?: Severity
}

export interface ConfirmEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', event: Event): void
  (e: 'cancel', event: Event): void
}
