import type { BaseProps, DisabledProps, InvalidProps } from '@amg-webui/types'

export interface CascaderOption {
  label: string
  value: unknown
  disabled?: boolean
  children?: CascaderOption[]
}

export interface CascaderProps extends BaseProps, DisabledProps, InvalidProps {
  /** Native id — falls back to FormItem field id when nested */
  id?: string
  /** Native name — falls back to FormItem `prop` when nested */
  name?: string
  modelValue?: unknown
  options?: CascaderOption[]
  placeholder?: string
  /** Show loading state in the dropdown panel */
  loading?: boolean
}

export interface CascaderEmits {
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', value: unknown): void
}
