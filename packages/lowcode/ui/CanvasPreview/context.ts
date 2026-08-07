import type { InjectionKey } from 'vue'
import type { ComponentRegistry, SchemaRenderMode } from '../../types'
import type { CanvasNodeData } from '@amg-webui/utils'

export interface CanvasPreviewHost {
  registry?: ComponentRegistry
  renderMode: SchemaRenderMode
  mode: 'free' | 'grid'
  selectedId: string | null
  interactive: boolean
  disabled: boolean
  columns: number
  activate: (node: CanvasNodeData, event: MouseEvent | KeyboardEvent) => void
}

export const CANVAS_PREVIEW_KEY: InjectionKey<CanvasPreviewHost> = Symbol('amg.canvasPreview')
