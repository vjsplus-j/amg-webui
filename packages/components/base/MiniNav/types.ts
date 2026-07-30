import type { BaseProps } from '@amg-webui/types'
import type { NavItem } from '@amg-webui/utils/nav'

export type { NavItem }

/** Same surface as TopNav — MiniNav is a vertical TopNav wrapper. */
export interface MiniNavProps extends BaseProps {
  items?: NavItem[]
  modelValue?: string | number
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
  trackId?: string
  telemetry?: boolean
}

export interface MiniNavEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: NavItem, event: MouseEvent): void
}
