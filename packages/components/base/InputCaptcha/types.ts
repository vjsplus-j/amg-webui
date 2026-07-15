import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface InputCaptchaProps extends BaseProps, DisabledProps {
  modelValue?: string
  length?: number
}

export interface InputCaptchaEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'verify', valid: boolean): void
  (e: 'refresh'): void
}
