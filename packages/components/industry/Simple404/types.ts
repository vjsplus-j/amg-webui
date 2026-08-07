import type { BaseProps } from '@amg-webui/types'

export interface Simple404Action {
  key: string
  label: string
  disabled?: boolean
}

export interface Simple404Props extends BaseProps {
  code?: string | number
  title?: string
  description?: string
  actions?: Simple404Action[]
  homeHref?: string
  retryable?: boolean
  modelValue?: string
  data?: unknown
  disabled?: boolean
  loading?: boolean
}

export interface Simple404Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'click', event: MouseEvent): void
  (e: 'action', action: Simple404Action, event: MouseEvent): void
  (e: 'home', event: MouseEvent): void
  (e: 'retry', event: MouseEvent): void
}
