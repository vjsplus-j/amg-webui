import { SelectOption, Size, BaseProps } from '@amg-webui/types'

export interface SelectProps extends BaseProps {
  modelValue?: unknown
  options?: SelectOption[]
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  filterable?: boolean
  clearable?: boolean
  invalid?: boolean
  size?: Size
  fluid?: boolean
  width?: string
  panelClass?: string
  panelStyle?: Record<string, string>
}

export interface SelectEmits {
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', event: { originalEvent: Event; value: unknown }): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'show'): void
  (e: 'hide'): void
}