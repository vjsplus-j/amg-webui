import type { BaseProps } from '@amg-webui/types'

export interface PrintProps extends BaseProps {
  title?: string
  disabled?: boolean
}

export interface PrintEmits {
  (e: 'print'): void
}
