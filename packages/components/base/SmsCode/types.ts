import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface SmsCodeProps extends BaseProps, DisabledProps {
  modelValue?: string
  countdown?: number
  phone?: string
}

export interface SmsCodeEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'send'): void
}
