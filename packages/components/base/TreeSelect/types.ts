import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface TreeSelectOption {
  label: string
  value: unknown
  disabled?: boolean
  children?: TreeSelectOption[]
}

export interface TreeSelectProps extends BaseProps, DisabledProps {
  modelValue?: unknown
  options?: TreeSelectOption[]
  placeholder?: string
}

export interface TreeSelectEmits {
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', value: unknown): void
}
