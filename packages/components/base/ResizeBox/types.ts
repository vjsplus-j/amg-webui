import type { BaseProps } from '@amg-webui/types'

export type ResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-right'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-left'

export interface ResizeBoxProps extends BaseProps {
  width?: number | string
  height?: number | string
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  directions?: ResizeDirection[]
}

export interface ResizeBoxEmits {
  (e: 'resize', payload: { width: number; height: number }): void
}
