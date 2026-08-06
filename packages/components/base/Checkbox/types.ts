import type { InjectionKey } from 'vue'
import type { BaseProps, DisabledProps, Size } from '@amg-webui/types'

export const CHECKBOX_GROUP_INJECTION_KEY: InjectionKey<CheckboxGroupContext> =
  Symbol('vp-checkbox-group')

export interface CheckboxGroupContext {
  modelValue: unknown[]
  disabled: boolean
  size?: Size
  toggle: (value: unknown, checked: boolean) => void
}

export interface CheckboxProps extends BaseProps, DisabledProps {
  modelValue?: boolean
  id?: string
  name?: string
  value?: unknown
  label?: string
  indeterminate?: boolean
  invalid?: boolean
  size?: Size
}

export interface CheckboxEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}
