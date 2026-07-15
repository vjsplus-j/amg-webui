import type { BaseProps, DisabledProps, Size } from '@amg-webui/types'

export interface InputNumberProps extends BaseProps, DisabledProps {
  modelValue?: number | null
  min?: number
  max?: number
  step?: number
  precision?: number
  controls?: boolean
  size?: Size
  fluid?: boolean
  invalid?: boolean
}

export interface InputNumberEmits {
  (e: 'update:modelValue', value: number | null): void
  (e: 'change', value: number | null): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}
