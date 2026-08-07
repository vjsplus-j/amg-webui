import type { ComputedRef, InjectionKey } from 'vue'
import type { BaseProps } from '@amg-webui/types'

export const FORM_ITEM_INJECTION_KEY: InjectionKey<FormItemContext> = Symbol('vp-form-item')

export interface FormItemContext {
  /** Stable id for label `for` + control `id` association */
  inputId: string
  errorId: string
  labelId: string
  /** True when the FormItem renders a visible label element */
  hasLabel: ComputedRef<boolean>
  prop: ComputedRef<string | undefined>
  error: ComputedRef<string | null>
  required: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  validate: () => Promise<string | null>
}

export interface FormItemProps extends BaseProps {
  prop?: string
  label?: string
  required?: boolean
  labelWidth?: string
  trackId?: string
  telemetry?: boolean
}

export interface FormItemEmits {
  (e: 'validate', error: string | null): void
}
