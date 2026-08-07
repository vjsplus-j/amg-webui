import type { BaseProps, DisabledProps, Size } from '@amg-webui/types'

export interface RadioOption {
  label: string
  value: unknown
  disabled?: boolean
}

export interface RadioGroupProps extends BaseProps, DisabledProps {
  modelValue?: unknown
  id?: string
  invalid?: boolean
  name?: string
  direction?: 'horizontal' | 'vertical'
  size?: Size
  /** Declarative options; can combine with default slot */
  options?: RadioOption[]
  ariaLabel?: string
}

export interface RadioGroupEmits {
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', value: unknown): void
}

export { RADIO_GROUP_INJECTION_KEY } from '../Radio/types'
export type { RadioGroupContext } from '../Radio/types'
