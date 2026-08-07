import type { BaseProps } from '@amg-webui/types'
import type { NavItem } from '@amg-webui/utils/nav'

export type { NavItem }
export type VerticalStepStatus = 'wait' | 'process' | 'finish' | 'error'

export interface VerticalStepNavItem extends NavItem {
  status?: VerticalStepStatus
}

export interface VerticalStepNavProps extends BaseProps {
  items?: VerticalStepNavItem[]
  modelValue?: string | number
  disabled?: boolean
  clickable?: boolean
  showIndex?: boolean
  completedIcon?: string
  errorIcon?: string
  ariaLabel?: string
}

export interface VerticalStepNavEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: VerticalStepNavItem, event: MouseEvent): void
}
