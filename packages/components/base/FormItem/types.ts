import type { BaseProps } from '@amg-webui/types'

export interface FormItemProps extends BaseProps {
  prop?: string
  label?: string
  required?: boolean
  labelWidth?: string
}

export interface FormItemEmits {
  (e: 'validate', error: string | null): void
}
