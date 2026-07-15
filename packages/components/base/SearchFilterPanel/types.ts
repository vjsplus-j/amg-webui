import type { BaseProps, DisabledProps } from '@amg-webui/types'
import type { FilterCondition, FilterFieldOption } from '../FilterBar/types'

export interface SearchFilterPanelProps extends BaseProps, DisabledProps {
  keyword?: string
  modelValue?: FilterCondition[]
  fields?: FilterFieldOption[]
  collapsed?: boolean
  loading?: boolean
}

export interface SearchFilterPanelEmits {
  (e: 'update:keyword', value: string): void
  (e: 'update:modelValue', value: FilterCondition[]): void
  (e: 'update:collapsed', value: boolean): void
  (e: 'search', payload: { keyword: string; conditions: FilterCondition[] }): void
  (e: 'reset'): void
}
