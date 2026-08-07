import type { BaseProps } from '@amg-webui/types'

export interface ClipboardProps extends BaseProps {
  text?: string
  modelValue?: string
  disabled?: boolean
  loading?: boolean
}

export interface ClipboardEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'copied', value: string): void
  (e: 'error', error: Error): void
}
