import type { Size, BaseProps } from '@amg-webui/types'
import type { ButtonSeverity, ButtonVariant } from '@amg-webui/core/Button/types'

export interface ButtonGroupProps extends BaseProps {
  size?: Size
  severity?: ButtonSeverity
  variant?: ButtonVariant
  /** Stretch group to full width */
  block?: boolean
  /** Layout axis for child buttons */
  direction?: 'horizontal' | 'vertical'
  /** Disable all cascaded children when Button honors group inject */
  disabled?: boolean
  /** Cascade loading state to child Buttons */
  loading?: boolean
  /** Accessible name for the group */
  ariaLabel?: string
}
