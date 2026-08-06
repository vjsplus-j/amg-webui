import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface InputCaptchaProps extends BaseProps, DisabledProps {
  modelValue?: string
  length?: number
  caseSensitive?: boolean
  refreshDelay?: number
  showRefreshButton?: boolean
  generator?: (length: number) => string
  ariaLabel?: string
}

export interface InputCaptchaEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'verify', valid: boolean): void
  (e: 'refresh'): void
  (e: 'generated', code: string): void
}
