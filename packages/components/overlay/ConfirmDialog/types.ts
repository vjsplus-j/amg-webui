import { Severity, BaseProps, VisibleEmits } from '@amg-webui/types'

export type ConfirmDialogIcon = Severity

export interface ConfirmDialogProps extends BaseProps {
  visible?: boolean
  title?: string
  message?: string
  icon?: ConfirmDialogIcon
  confirmLabel?: string
  cancelLabel?: string
  modal?: boolean
  draggable?: boolean
  closable?: boolean
  dismissible?: boolean
}

export interface ConfirmDialogEmits extends VisibleEmits {
  (e: 'confirm', event: Event): void
  (e: 'cancel', event: Event): void
}