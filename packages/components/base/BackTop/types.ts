import type { BaseProps } from '@amg-webui/types'

export interface BackTopProps extends BaseProps {
  visibilityHeight?: number
  right?: string
  bottom?: string
}

export interface BackTopEmits {
  (e: 'click', event: MouseEvent): void
}
