import type { BaseProps } from '@amg-webui/types'

export interface Ink404Props extends BaseProps {
  code?: string | number
  title?: string
  description?: string
  data?: unknown
  modelValue?: unknown
  disabled?: boolean
  loading?: boolean
  actionText?: string
  retryable?: boolean
}

export interface Ink404Emits {
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', value: unknown): void
  (e: 'click', event: MouseEvent): void
  (e: 'retry', event: MouseEvent): void
}
