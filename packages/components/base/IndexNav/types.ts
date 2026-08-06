import type { BaseProps } from '@amg-webui/types'
import type { NavItem } from '@amg-webui/utils/nav'

export type { NavItem }

export interface IndexNavProps extends BaseProps {
  items?: NavItem[]
  modelValue?: string | number
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
  scrollToTarget?: boolean
  scrollBehavior?: ScrollBehavior
  sticky?: boolean
  ariaLabel?: string
}

export interface IndexNavEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: NavItem, event: MouseEvent): void
  (e: 'navigate', item: NavItem, target?: HTMLElement): void
}
