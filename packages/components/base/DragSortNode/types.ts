import type { BaseProps } from '@amg-webui/types'
import type { CanvasNodeData } from '@amg-webui/utils'

export interface DragSortNodeProps extends BaseProps {
  nodes?: CanvasNodeData[]
}

export interface DragSortNodeEmits {
  (e: 'reorder', nodes: CanvasNodeData[]): void
}
