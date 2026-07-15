import type { BaseProps } from '@amg-webui/types'

export interface SpacerProps extends BaseProps {
  title?: string
  description?: string
  data?: unknown
  modelValue?: unknown
  disabled?: boolean
  loading?: boolean
}

export interface SpacerEmits {
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', value: unknown): void
  (e: 'click', event: MouseEvent): void
}
