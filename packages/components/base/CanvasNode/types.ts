import type { BaseProps } from '@amg-webui/types'
import type { CanvasNodeData } from '@amg-webui/utils'
import type { ComponentRegistry, SchemaRenderMode } from '@amg-webui/lowcode'

export interface CanvasNodeProps extends BaseProps {
  node: CanvasNodeData
  selectable?: boolean
  draggable?: boolean
  keyboardStep?: number
  registry?: ComponentRegistry
  renderMode?: SchemaRenderMode
}

export interface CanvasNodeEmits {
  (e: 'select', id: string): void
  (e: 'move', payload: { id: string; x: number; y: number }): void
  (e: 'moveStart', payload: { id: string; x: number; y: number }): void
  (e: 'moveEnd', payload: { id: string; x: number; y: number }): void
}
