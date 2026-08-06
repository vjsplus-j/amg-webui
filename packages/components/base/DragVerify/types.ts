import type { BaseProps } from '@amg-webui/types'

export interface DragVerifyProps extends BaseProps {
  modelValue?: boolean
  disabled?: boolean
  threshold?: number
  width?: string
  resetOnFail?: boolean
  keyboardStep?: number
}

export interface DragVerifyEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
  (e: 'fail'): void
  (e: 'change', payload: { passed: boolean; offset: number; progress: number }): void
  (e: 'reset'): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}
