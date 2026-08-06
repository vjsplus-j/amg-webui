import type { BaseProps } from '@amg-webui/types'

export interface Doodle404Props extends BaseProps {
  code?: string | number
  title?: string
  description?: string
  actions?: Array<{ key: string; label: string; href?: string; disabled?: boolean }>
  homeHref?: string
  retryable?: boolean
  data?: unknown
  modelValue?: string | number | null
  disabled?: boolean
  loading?: boolean
}

export interface Doodle404Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'click', event: MouseEvent): void
  (e: 'action', action: { key: string; label: string; href?: string; disabled?: boolean }, event: MouseEvent): void
  (e: 'home', event: MouseEvent): void
  (e: 'retry', event: MouseEvent): void
}
