import type { BaseProps, DisabledProps, InvalidProps, ReadonlyProps, Size } from '@amg-webui/types'

export interface InputOTPProps extends BaseProps, DisabledProps, ReadonlyProps, InvalidProps {
  /** Native id — falls back to FormItem field id when nested; applied to first cell */
  id?: string
  /** Native name — falls back to FormItem `prop` when nested */
  name?: string
  modelValue?: string
  length?: number
  mask?: boolean
  autofocus?: boolean
  type?: 'text' | 'number'
  size?: Size
}

export interface InputOTPEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'complete', value: string): void
}
