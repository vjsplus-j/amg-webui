import type { BaseProps } from '@amg-webui/types'
import type { CanvasNodeData } from '@amg-webui/utils'

export interface CanvasNodeProps extends BaseProps {
  node: CanvasNodeData
}

export interface CanvasNodeEmits {
  (e: 'select', id: string): void
}
