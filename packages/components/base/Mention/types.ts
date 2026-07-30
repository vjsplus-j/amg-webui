import type { BaseProps, DisabledProps, LoadingProps } from '@amg-webui/types'

export interface MentionOption {
  label: string
  value: string
  disabled?: boolean
}

export interface MentionProps extends BaseProps, DisabledProps, LoadingProps {
  modelValue?: string
  options?: MentionOption[]
  prefix?: string
  placeholder?: string
  rows?: number
  maxLength?: number
}

export interface MentionEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'select', option: MentionOption): void
  (e: 'search', query: string): void
}
