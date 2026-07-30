import type { BaseProps } from '@amg-webui/types'

export interface PageHeaderProps extends BaseProps {
  title?: string
  subtitle?: string
  back?: boolean
  backLabel?: string
}

export interface PageHeaderEmits {
  (e: 'back', event: MouseEvent): void
}
