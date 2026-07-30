import type { BaseProps } from '@amg-webui/types'
import type { CanvasNodeData } from '@amg-webui/utils'

export interface DragSortNodeProps extends BaseProps {
  nodes?: CanvasNodeData[]
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface DragSortNodeEmits {
  (e: 'reorder', nodes: CanvasNodeData[]): void
  (e: 'clear'): void
}
