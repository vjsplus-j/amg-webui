import type { BaseProps, DisabledProps, Size } from '@amg-webui/types'

export interface PasswordProps extends BaseProps, DisabledProps {
  modelValue?: string
  showToggle?: boolean
  placeholder?: string
  size?: Size
  fluid?: boolean
  invalid?: boolean
}

export interface PasswordEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'input', event: Event): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}
