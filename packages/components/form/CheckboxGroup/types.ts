import type { BaseProps, DisabledProps, Size } from '@amg-webui/types'

export interface CheckboxOption {
  label: string
  value: unknown
  disabled?: boolean
}

export interface CheckboxGroupProps extends BaseProps, DisabledProps {
  modelValue?: unknown[]
  id?: string
  invalid?: boolean
  direction?: 'horizontal' | 'vertical'
  size?: Size
  /** Max selectable count; omit = unlimited */
  max?: number
  /** Min selectable count (soft hint via aria only) */
  min?: number
  /** Declarative options; can combine with default slot */
  options?: CheckboxOption[]
  ariaLabel?: string
}

export interface CheckboxGroupEmits {
  (e: 'update:modelValue', value: unknown[]): void
  (e: 'change', value: unknown[]): void
}

export { CHECKBOX_GROUP_INJECTION_KEY } from '../Checkbox/types'
export type { CheckboxGroupContext } from '../Checkbox/types'
