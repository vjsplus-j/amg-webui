import type { BaseProps } from '@amg-webui/types'
import type { CanvasNodeData, CanvasSchema } from '@amg-webui/utils'
import type { ComponentRegistry, LowcodeEventHandlers, LowcodeNodeEventPayload, LowcodeRenderContext, SchemaRenderMode } from '../../types'

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
  /**
   * Runtime state for `__bindings` path expressions (e.g. `form.name`).
   * Prefer a reactive object so binding updates re-render.
   */
  context?: LowcodeRenderContext
  /** Named handlers for `__events` / registry `events` stubs (same names as codegen). */
  handlers?: LowcodeEventHandlers
}

export interface SchemaRendererEmits {
  (e: 'select', id: string): void
  (e: 'nodeActivate', node: CanvasNodeData, event: MouseEvent | KeyboardEvent): void
  (e: 'nodeEvent', payload: LowcodeNodeEventPayload): void
}
