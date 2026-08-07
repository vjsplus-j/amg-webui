import { MessageBox } from './service'
import MessageBoxHost from './MessageBoxHost.vue'

export { MessageBox, MessageBoxHost }
export type {
  MessageBoxOptions,
  MessageBoxHostProps,
  MessageBoxHostEmits,
  MessageBoxConfirmResult,
  MessageBoxAlertResult,
  MessageBoxPromptResult,
  MessageBoxMode,
  MessageBoxAction,
  MessageBoxCloseReason,
  MessageBoxAutofocus,
  MessageBoxInputType
} from './types'
export default MessageBox
