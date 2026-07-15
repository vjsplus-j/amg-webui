import type { BaseProps } from '@amg-webui/types'

export interface NavItem {
  label: string
  value?: string | number
  icon?: string
  disabled?: boolean
  href?: string
  to?: string
  children?: NavItem[]
}


export interface StepNavProps extends BaseProps {
  items?: NavItem[]
  modelValue?: string | number
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
}

export interface StepNavEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: NavItem, event: MouseEvent): void
}
