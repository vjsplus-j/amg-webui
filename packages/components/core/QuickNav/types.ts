import type { BaseProps } from '@amg-webui/types'
import type { NavItem } from '@amg-webui/utils/nav'

export type { NavItem }
export type QuickNavVariant = 'grid' | 'pills'

export interface QuickNavProps extends BaseProps {
  items?: NavItem[]
  modelValue?: string | number
  disabled?: boolean
  variant?: QuickNavVariant
  columns?: number
  showDescriptions?: boolean
  ariaLabel?: string
}

export interface QuickNavEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: NavItem, event: MouseEvent): void
}
