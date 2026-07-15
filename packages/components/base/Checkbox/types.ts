import type { InjectionKey } from 'vue'
import type { BaseProps, DisabledProps } from '@amg-webui/types'

export const CHECKBOX_GROUP_INJECTION_KEY: InjectionKey<CheckboxGroupContext> =
  Symbol('vp-checkbox-group')

export interface CheckboxGroupContext {
  modelValue: unknown[]
  disabled: boolean
  toggle: (value: unknown, checked: boolean) => void
}

export interface CheckboxProps extends BaseProps, DisabledProps {
  modelValue?: boolean
  value?: unknown
  label?: string
  indeterminate?: boolean
}

export interface CheckboxEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}

export interface CheckboxGroupProps extends BaseProps, DisabledProps {
  modelValue?: unknown[]
  direction?: 'horizontal' | 'vertical'
}

export interface CheckboxGroupEmits {
  (e: 'update:modelValue', value: unknown[]): void
  (e: 'change', value: unknown[]): void
}
