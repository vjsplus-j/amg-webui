import type { BaseProps } from '@amg-webui/types'
import type { NavItem } from '@amg-webui/utils/nav'

export type { NavItem }
export type CategoryNavVariant = 'pills' | 'cards'
export type CategoryNavSize = 'sm' | 'md' | 'lg'

export interface CategoryNavProps extends BaseProps {
  items?: NavItem[]
  modelValue?: string | number
  disabled?: boolean
  variant?: CategoryNavVariant
  size?: CategoryNavSize
  wrap?: boolean
  ariaLabel?: string
}

export interface CategoryNavEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: NavItem, event: MouseEvent): void
}
