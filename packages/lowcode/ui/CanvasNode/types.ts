import type { BaseProps } from '@amg-webui/types'
import type { CanvasNodeData } from '@amg-webui/utils'
import type { CanvasTreeNode } from '../../tree'
import type { ComponentRegistry, SchemaRenderMode } from '../../types'

export interface CanvasNodeProps extends BaseProps {
  node: CanvasNodeData
  /** Nested under a parent — flow layout, not free-canvas absolute. */
  nested?: boolean
  /** Child tree from `buildCanvasTree` (recursive mount). */
  children?: CanvasTreeNode[]
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
