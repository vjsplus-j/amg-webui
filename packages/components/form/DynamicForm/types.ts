import type { BaseProps, DisabledProps } from '@amg-webui/types'

export type DynamicFieldType = 'text' | 'number' | 'select' | 'switch' | 'date'

export interface DynamicFieldOption {
  label: string
  value: unknown
}

export interface DynamicFieldSchema {
  key: string
  label: string
  type: DynamicFieldType
  required?: boolean
  options?: DynamicFieldOption[]
  visible?: boolean
}

export interface DynamicFormProps extends BaseProps, DisabledProps {
  modelValue?: Record<string, unknown>
  schema?: DynamicFieldSchema[]
  loading?: boolean
}

export interface DynamicFormEmits {
  (e: 'update:modelValue', value: Record<string, unknown>): void
  (e: 'change', value: Record<string, unknown>): void
  (e: 'submit', value: Record<string, unknown>): void
}
