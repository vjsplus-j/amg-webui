import type { InjectionKey, CSSProperties, Slot } from 'vue'
import type { CanvasNodeData } from '@amg-webui/utils'
import type { ComponentRegistry, LowcodeEventHandlers, LowcodeRenderContext, SchemaRenderMode } from '../../types'
import type { CanvasTreeNode } from '../../tree'

export interface SchemaNodeSlotProps {
  node: CanvasTreeNode
  selected: boolean
}

export interface SchemaRendererContext {
  registry?: ComponentRegistry
  renderMode: SchemaRenderMode
  selectedId: string | null
  interactive: boolean
  disabled: boolean
  context?: LowcodeRenderContext
  handlers?: LowcodeEventHandlers
  nodeStyle: (node: CanvasNodeData, nested: boolean) => CSSProperties
  activate: (node: CanvasNodeData, event: MouseEvent | KeyboardEvent) => void
  onNodeEvent: (payload: {
    nodeId: string
    event: string
    handler: string
    args: unknown[]
  }) => void
  /** Optional `#node` slot from SchemaRenderer — available at every depth. */
  nodeSlot?: Slot<SchemaNodeSlotProps>
  trackId?: string
  telemetry?: boolean
}

export const SCHEMA_RENDERER_KEY: InjectionKey<SchemaRendererContext> = Symbol(
  'amg.schemaRenderer'
)
