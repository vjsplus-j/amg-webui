import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface CascaderOption {
  label: string
  value: unknown
  disabled?: boolean
  children?: CascaderOption[]
}

export interface CascaderProps extends BaseProps, DisabledProps {
  modelValue?: unknown
  options?: CascaderOption[]
  placeholder?: string
}

export interface CascaderEmits {
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', value: unknown): void
}
