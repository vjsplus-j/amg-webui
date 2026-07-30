import type { BaseProps, DisabledProps, LoadingProps } from '@amg-webui/types'

export interface SmsCodeProps extends BaseProps, DisabledProps, LoadingProps {
  modelValue?: string
  /** Countdown seconds after send */
  countdown?: number
  /** Expected digit length */
  length?: number
  phone?: string
}

export interface SmsCodeEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'send'): void
  (e: 'complete', value: string): void
}
