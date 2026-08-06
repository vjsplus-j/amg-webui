import type { BaseProps } from '@amg-webui/types'
import type { CanvasNodeData, CanvasSchema } from '@amg-webui/utils'
import type { ComponentRegistry, SchemaRenderMode } from '@amg-webui/lowcode'

export interface SchemaRendererProps extends BaseProps {
  /** Full schema or nodes-only array. */
  schema?: CanvasSchema | CanvasNodeData[] | null
  nodes?: CanvasNodeData[]
  mode?: 'free' | 'grid'
  registry?: ComponentRegistry
  /** `component` mounts real Vue components; `chrome` shows label/type placeholders. */
  renderMode?: SchemaRenderMode
  columns?: number
  selectedId?: string | null
  interactive?: boolean
  disabled?: boolean
  emptyText?: string
}

export interface SchemaRendererEmits {
  (e: 'select', id: string): void
  (e: 'nodeActivate', node: CanvasNodeData, event: MouseEvent | KeyboardEvent): void
}
