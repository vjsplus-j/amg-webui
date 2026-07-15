import type { BaseProps } from '@amg-webui/types'
import type { CanvasNodeData } from '@amg-webui/utils'

export interface CanvasPreviewProps extends BaseProps {
  nodes?: CanvasNodeData[]
  mode?: 'free' | 'grid'
}

export interface CanvasPreviewEmits {
  (e: 'click', event: MouseEvent): void
}
