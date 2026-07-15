import type { BaseProps } from '@amg-webui/types'

export interface ExceptionProps extends BaseProps {
  status?: '403' | '404' | '500' | 'offline'
  title?: string
  description?: string
}

export interface ExceptionEmits {
  (e: 'action', event: MouseEvent): void
}
