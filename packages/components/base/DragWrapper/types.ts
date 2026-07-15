import type { BaseProps } from '@amg-webui/types'

export interface DragWrapperProps extends BaseProps {
  label?: string
  nested?: boolean
}

export interface DragWrapperEmits {
  (e: 'drop', type: string): void
}
