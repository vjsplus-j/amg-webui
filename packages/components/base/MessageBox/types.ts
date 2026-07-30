import type { BaseProps } from '@amg-webui/types'
import type { ConfirmSeverity } from '../Confirm/types'

export type MessageBoxMode = 'confirm' | 'alert' | 'prompt'

export interface MessageBoxOptions {
  severity?: ConfirmSeverity
  confirmLabel?: string
  cancelLabel?: string
  dismissible?: boolean
  closable?: boolean
  inputPlaceholder?: string
  inputValue?: string
  inputPattern?: RegExp | string
  inputErrorMessage?: string
  showCancel?: boolean
}

export interface MessageBoxHostProps extends MessageBoxOptions, BaseProps {
  visible?: boolean
  title?: string
  message?: string
  mode?: MessageBoxMode
}

export interface MessageBoxHostEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', value?: string): void
  (e: 'cancel'): void
}

export type MessageBoxConfirmResult = 'confirm' | 'cancel'
export type MessageBoxAlertResult = 'confirm'
export type MessageBoxPromptResult = { value: string } | 'cancel'
