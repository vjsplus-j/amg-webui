import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface FilterCondition {
  id: string
  field: string
  operator: string
  value: string
}

export interface FilterFieldOption {
  label: string
  value: string
}

export interface FilterBarProps extends BaseProps, DisabledProps {
  modelValue?: FilterCondition[]
  fields?: FilterFieldOption[]
  collapsed?: boolean
  loading?: boolean
}

export interface FilterBarEmits {
  (e: 'update:modelValue', value: FilterCondition[]): void
  (e: 'update:collapsed', value: boolean): void
  (e: 'change', value: FilterCondition[]): void
  (e: 'search', value: FilterCondition[]): void
  (e: 'reset'): void
}
