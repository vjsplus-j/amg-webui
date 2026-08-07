import type { BaseProps } from '@amg-webui/types'
import type { ComponentRegistry } from '../../types'

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
  /** When true, write into node.props instead of top-level geometry fields. */
  fromProps?: boolean
}

export interface PropPanelProps extends BaseProps {
  fields?: PropField[]
  /** When set, merge layout fields + registry propsSchema for the selected node. */
  registry?: ComponentRegistry
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
