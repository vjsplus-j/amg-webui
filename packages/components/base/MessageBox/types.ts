import type { BaseProps } from '@amg-webui/types'
import type { ConfirmSeverity } from '../Confirm/types'

export type MessageBoxMode = 'confirm' | 'alert' | 'prompt'
export type MessageBoxAction = 'confirm' | 'cancel'
export type MessageBoxCloseReason =
  | 'cancel'
  | 'close'
  | 'overlay'
  | 'escape'
  | 'programmatic'
  | 'replaced'
export type MessageBoxAutofocus = 'confirm' | 'cancel' | 'input' | 'none'
export type MessageBoxInputType = 'text' | 'password' | 'email' | 'tel' | 'url'

export interface MessageBoxOptions {
  severity?: ConfirmSeverity
  confirmLabel?: string
  cancelLabel?: string
  dismissible?: boolean
  closable?: boolean
  inputPlaceholder?: string
  inputValue?: string
  inputPattern?: RegExp | string
  inputValidator?: (value: string) => boolean | string | Promise<boolean | string>
  inputErrorMessage?: string
  inputType?: MessageBoxInputType
  showCancel?: boolean
  closeOnClickOverlay?: boolean
  closeOnPressEscape?: boolean
  autofocus?: MessageBoxAutofocus
  beforeClose?: (
    action: MessageBoxAction,
    value?: string
  ) => boolean | Promise<boolean>
  teleportTo?: string | HTMLElement
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
  (e: 'cancel', reason: MessageBoxCloseReason): void
}

export type MessageBoxConfirmResult = 'confirm' | 'cancel'
export type MessageBoxAlertResult = 'confirm'
export type MessageBoxPromptResult = { value: string } | 'cancel'
