import Button from './index.vue'
import type {
  ButtonProps,
  ButtonShape,
  ButtonSeverity,
  ButtonIconPos,
  ButtonEmits,
  ButtonVariant,
  ButtonClickGuard,
  ButtonPermissionMode,
  ButtonNativeType
} from './types'
import { BUTTON_CONFIG_KEY, BUTTON_GROUP_KEY } from './config'
import type { ButtonGlobalConfig } from './config'

export { Button, BUTTON_CONFIG_KEY, BUTTON_GROUP_KEY }
export type {
  ButtonProps,
  ButtonShape,
  ButtonSeverity,
  ButtonIconPos,
  ButtonEmits,
  ButtonVariant,
  ButtonClickGuard,
  ButtonPermissionMode,
  ButtonNativeType,
  ButtonGlobalConfig
}
export default Button
