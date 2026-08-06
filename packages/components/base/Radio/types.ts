import type { InjectionKey } from 'vue'
import type { BaseProps, DisabledProps, Size } from '@amg-webui/types'

export const RADIO_GROUP_INJECTION_KEY: InjectionKey<RadioGroupContext> = Symbol('vp-radio-group')

export interface RadioGroupContext {
  modelValue: unknown
  disabled: boolean
  name?: string
  size?: Size
  change: (value: unknown) => void
}

export interface RadioProps extends BaseProps, DisabledProps {
  modelValue?: unknown
  id?: string
  value: unknown
  label?: string
  name?: string
  invalid?: boolean
  size?: Size
}

export interface RadioEmits {
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', value: unknown): void
}
