import type { BaseProps } from '@amg-webui/types'

export interface PropField {
  key: string
  label?: string
  type?: 'text' | 'number' | 'boolean' | 'textarea' | 'select' | 'color'
  description?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  options?: Array<{ label: string; value: string | number }>
  disabled?: boolean
}

export interface PropPanelProps extends BaseProps {
  fields?: PropField[]
  readonly?: boolean
  modelValue?: Record<string, unknown>
  title?: string
  emptyText?: string
}

export interface PropPanelEmits {
  (e: 'update:prop', payload: { key: string; value: unknown }): void
  (e: 'update:modelValue', value: Record<string, unknown>): void
  (e: 'change', payload: { key: string; value: unknown }): void
}
