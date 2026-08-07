import type { BaseProps, DisabledProps } from '@amg-webui/types'
import type { FilterCondition, FilterFieldOption } from '../FilterBar/types'

export type SearchLogic = 'and' | 'or'

export interface AdvancedSearchProps extends BaseProps, DisabledProps {
  modelValue?: FilterCondition[]
  logic?: SearchLogic
  fields?: FilterFieldOption[]
  templates?: { id: string; name: string; conditions: FilterCondition[]; logic: SearchLogic }[]
  loading?: boolean
}

export interface AdvancedSearchEmits {
  (e: 'update:modelValue', value: FilterCondition[]): void
  (e: 'update:logic', value: SearchLogic): void
  (e: 'change', value: FilterCondition[]): void
  (e: 'search', payload: { conditions: FilterCondition[]; logic: SearchLogic }): void
  (e: 'save-template', payload: { conditions: FilterCondition[]; logic: SearchLogic }): void
}
