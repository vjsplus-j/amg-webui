import type { BaseProps, DisabledProps, InvalidProps, LoadingProps } from '@amg-webui/types'

export interface MentionOption {
  label: string
  value: string
  disabled?: boolean
}

export interface MentionProps extends BaseProps, DisabledProps, LoadingProps, InvalidProps {
  /** Native id — falls back to FormItem field id when nested */
  id?: string
  /** Native name — falls back to FormItem `prop` when nested */
  name?: string
  modelValue?: string
  options?: MentionOption[]
  prefix?: string
  placeholder?: string
  rows?: number
  maxLength?: number
  ariaLabel?: string
}

export interface MentionEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'select', option: MentionOption): void
  (e: 'search', query: string): void
}
