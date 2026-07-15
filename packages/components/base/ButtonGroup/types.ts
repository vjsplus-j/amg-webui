import type { Size, BaseProps } from '@amg-webui/types'
import type { ButtonSeverity, ButtonVariant } from '../Button/types'

export interface ButtonGroupProps extends BaseProps {
  size?: Size
  severity?: ButtonSeverity
  variant?: ButtonVariant
  /** Stretch group to full width */
  block?: boolean
}
