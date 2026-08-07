import type { BaseProps, DisabledProps, Size } from '@amg-webui/types'

export interface SearchProps extends BaseProps, DisabledProps {
  modelValue?: string
  /** Native input id — falls back to FormItem field id when nested */
  id?: string
  name?: string
  placeholder?: string
  clearable?: boolean
  size?: Size
  fluid?: boolean
  invalid?: boolean
}

export interface SearchEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
  (e: 'clear'): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}
