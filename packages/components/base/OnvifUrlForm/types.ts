import type { BaseProps } from '@amg-webui/types'
export interface OnvifUrlFormProps extends BaseProps {
  modelValue?: string
  disabled?: boolean
  loading?: boolean
  title?: string
}

export interface OnvifUrlFormEmits {
  (e: 'update:modelValue', v: string): void
  (e: 'test', url: string): void
  (e: 'invalid'): void
}
