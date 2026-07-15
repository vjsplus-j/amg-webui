import type { BaseProps } from '@amg-webui/types'

export interface DragVerifyProps extends BaseProps {
  modelValue?: boolean
  disabled?: boolean
}

export interface DragVerifyEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}
