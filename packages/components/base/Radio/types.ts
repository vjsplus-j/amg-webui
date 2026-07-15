import type { InjectionKey } from 'vue'
import type { BaseProps, DisabledProps } from '@amg-webui/types'

export const RADIO_GROUP_INJECTION_KEY: InjectionKey<RadioGroupContext> = Symbol('vp-radio-group')

export interface RadioGroupContext {
  modelValue: unknown
  disabled: boolean
  name?: string
  change: (value: unknown) => void
}

export interface RadioProps extends BaseProps, DisabledProps {
  modelValue?: unknown
  value: unknown
  label?: string
  name?: string
}

export interface RadioEmits {
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', value: unknown): void
}

export interface RadioGroupProps extends BaseProps, DisabledProps {
  modelValue?: unknown
  name?: string
  direction?: 'horizontal' | 'vertical'
}

export interface RadioGroupEmits {
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', value: unknown): void
}
