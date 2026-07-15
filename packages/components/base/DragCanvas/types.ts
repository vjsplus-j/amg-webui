import type { BaseProps } from '@amg-webui/types'
import type { CanvasNodeData, CanvasMaterialItem } from '@amg-webui/utils'

export interface DragCanvasProps extends BaseProps {
  modelValue?: CanvasNodeData[]
  mode?: 'free' | 'grid'
  readonly?: boolean
  materials?: CanvasMaterialItem[]
  gridCols?: number
}

export interface DragCanvasEmits {
  (e: 'update:modelValue', value: CanvasNodeData[]): void
  (e: 'select', ids: string[]): void
  (e: 'change', value: CanvasNodeData[]): void
}
