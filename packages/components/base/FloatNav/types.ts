import type { BaseProps } from '@amg-webui/types'
import type { NavItem } from '@amg-webui/utils/nav'

export type { NavItem }

export type FloatNavPlacement =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'

export interface FloatNavProps extends BaseProps {
  items?: NavItem[]
  modelValue?: string | number
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
  /** Fixed corner placement (token insets) */
  placement?: FloatNavPlacement
  /** Teleport FAB cluster to document.body */
  teleport?: boolean
  /** Accessible name for the nav landmark */
  ariaLabel?: string
  trackId?: string
  telemetry?: boolean
}

export interface FloatNavEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: NavItem, event: MouseEvent): void
}
