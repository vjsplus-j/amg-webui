import type { BaseProps, Severity } from '@amg-webui/types'

/** Confirm tones — includes Button-aligned `contrast` (black / high-ink). */
export type ConfirmSeverity = Severity | 'contrast'

export interface ConfirmProps extends BaseProps {
  visible?: boolean
  title?: string
  message?: string
  closable?: boolean
  dismissible?: boolean
  confirmLabel?: string
  cancelLabel?: string
  severity?: ConfirmSeverity
}

export interface ConfirmEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', event: Event): void
  (e: 'cancel', event: Event): void
}
