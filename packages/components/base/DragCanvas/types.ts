import type { BaseProps } from '@amg-webui/types'
import type { CanvasNodeData, CanvasMaterialItem } from '@amg-webui/utils'
import type { ComponentRegistry } from '@amg-webui/lowcode'

export interface DragCanvasProps extends BaseProps {
  modelValue?: CanvasNodeData[]
  mode?: 'free' | 'grid'
  readonly?: boolean
  materials?: CanvasMaterialItem[]
  gridCols?: number
  /** When set, canvas nodes mount real components (WYSIWYG). */
  registry?: ComponentRegistry
  /** `component` = registry mount; `chrome` = label/type placeholder. */
  renderMode?: 'chrome' | 'component'
}

export interface DragCanvasEmits {
  (e: 'update:modelValue', value: CanvasNodeData[]): void
  (e: 'select', ids: string[]): void
  (e: 'change', value: CanvasNodeData[]): void
}
