import type { BaseProps, DisabledProps, LoadingProps } from '@amg-webui/types'

export interface LoginFormModel {
  username?: string
  password?: string
  remember?: boolean
  captcha?: string
}

export interface LoginPanelProps extends BaseProps, DisabledProps, LoadingProps {
  modelValue?: LoginFormModel
}

export interface LoginPanelEmits {
  (e: 'update:modelValue', value: LoginFormModel): void
  (e: 'submit', value: LoginFormModel): void
}
