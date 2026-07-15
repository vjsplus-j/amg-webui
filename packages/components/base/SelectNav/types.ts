import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface SelectNavItem {
  label: string
  value: string | number
  icon?: string
}

export interface SelectNavProps extends BaseProps, DisabledProps {
  modelValue?: string | number
  options?: SelectNavItem[]
}

export interface SelectNavEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'navigate', item: SelectNavItem): void
}
