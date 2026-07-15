import type { BaseProps, Severity, Shape } from '@amg-webui/types'

export interface FloatButtonProps extends BaseProps {
  type?: Severity
  severity?: Severity
  shape?: Shape
  icon?: string
  href?: string
  top?: string | number
  right?: string | number
  bottom?: string | number
  left?: string | number
  /** Controlled menu open state (when `#menu` slot is used) */
  open?: boolean
}

export interface FloatButtonEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'update:open', open: boolean): void
  (e: 'openChange', open: boolean): void
}
