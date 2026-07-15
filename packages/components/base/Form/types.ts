import type { InjectionKey } from 'vue'
import type { BaseProps } from '@amg-webui/types'

export const FORM_INJECTION_KEY: InjectionKey<FormContext> = Symbol('vp-form')

export interface FormRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  message?: string
  validator?: (value: unknown) => boolean | string | Promise<boolean | string>
}

export type FormRules = Record<string, FormRule | FormRule[]>

export interface FormContext {
  model: Record<string, unknown>
  rules?: FormRules
  disabled?: boolean
  labelWidth?: string
  validateField: (prop: string) => Promise<string | null>
  registerError: (prop: string, error: string | null) => void
  getError: (prop: string) => string | null
}

export interface FormProps extends BaseProps {
  model?: Record<string, unknown>
  rules?: FormRules
  disabled?: boolean
  labelWidth?: string
  labelPosition?: 'left' | 'top'
}

export interface FormEmits {
  (e: 'validate', valid: boolean, errors: Record<string, string>): void
  (e: 'submit'): void
}
