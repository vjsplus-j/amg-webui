import type { BaseProps, DisabledProps, InvalidProps } from '@amg-webui/types'

export interface InputCaptchaProps extends BaseProps, DisabledProps, InvalidProps {
  /** Native id — falls back to FormItem field id when nested */
  id?: string
  /** Native name — falls back to FormItem `prop` when nested */
  name?: string
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
