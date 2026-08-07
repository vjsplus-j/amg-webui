import type { BaseProps } from '@amg-webui/types'
import type { NavItem } from '@amg-webui/utils/nav'

export type { NavItem }

export interface MiniNavProps extends BaseProps {
  items?: NavItem[]
  modelValue?: string | number
  disabled?: boolean
  collapsed?: boolean
  showBadges?: boolean
  ariaLabel?: string
}

export interface MiniNavEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: NavItem, event: MouseEvent): void
}
