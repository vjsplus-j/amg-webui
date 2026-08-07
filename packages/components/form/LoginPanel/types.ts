import type { BaseProps, DisabledProps, LoadingProps } from '@amg-webui/types'
import type { FormRule } from '@amg-webui/form/Form/types'

export interface LoginFormModel {
  username?: string
  password?: string
  remember?: boolean
  captcha?: string
}

export interface LoginPanelProps extends BaseProps, DisabledProps, LoadingProps {
  modelValue?: LoginFormModel
  /** Built-in validation rules keyed by prop */
  rules?: Record<string, FormRule | FormRule[]>
  showCaptcha?: boolean
  showRemember?: boolean
  showForgot?: boolean
  showRegister?: boolean
}

export interface LoginPanelEmits {
  (e: 'update:modelValue', value: LoginFormModel): void
  (e: 'submit', value: LoginFormModel): void
  (e: 'forgot-password'): void
  (e: 'register'): void
}
