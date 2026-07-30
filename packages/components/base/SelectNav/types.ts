import type { BaseProps, DisabledProps } from '@amg-webui/types'
import type { NavItem } from '@amg-webui/utils/nav'

export type { NavItem }

export interface SelectNavItem extends NavItem {
  label: string
  value: string | number
}

export interface SelectNavProps extends BaseProps, DisabledProps {
  modelValue?: string | number
  options?: SelectNavItem[]
  /** Accessible name for the nav / select */
  ariaLabel?: string
  placeholder?: string
  trackId?: string
  telemetry?: boolean
}

export interface SelectNavEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: SelectNavItem, event?: Event): void
  (e: 'navigate', item: SelectNavItem): void
}
