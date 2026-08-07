import type { BaseProps } from '@amg-webui/types'
import type { NotFoundAction } from '@amg-webui/hooks'

export type { NotFoundAction as Machine404Action }

export interface Machine404Props extends BaseProps {
  title?: string
  description?: string
  code?: string | number
  actions?: NotFoundAction[]
  modelValue?: string
  disabled?: boolean
  loading?: boolean
  retryable?: boolean
  homeHref?: string
  homeText?: string
}

export interface Machine404Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'click', event: MouseEvent): void
  (e: 'action', action: NotFoundAction, event: MouseEvent): void
  (e: 'retry', event: MouseEvent): void
  (e: 'home', event: MouseEvent): void
}
