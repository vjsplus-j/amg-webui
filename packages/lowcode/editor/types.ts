import type { Ref, ComputedRef } from 'vue'
import type { CanvasNodeData, CanvasSchema } from '@amg-webui/utils'

export interface Command {
  readonly id: string
  readonly label: string
  execute(): void
  undo(): void
  redo(): void
}

export interface ViewportTransform {
  zoom: number
  panX: number
  panY: number
}

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface GuideLine {
  orientation: 'h' | 'v'
  position: number
  /** Optional distance label (canvas units). */
  distance?: number
}

export interface DropRuleContext {
  parentType: string | null
  childType: string
  slot?: string
  parentIsContainer?: boolean
  accepts?: readonly string[]
  parentRules?: readonly string[]
}

export interface LowcodeEditorOptions {
  schema?: CanvasSchema
  nodes?: CanvasNodeData[]
  mode?: 'free' | 'grid'
  readonly?: boolean
  historyLimit?: number
  /** Grid snap size in canvas units. */
  gridSize?: number
  onChange?: () => void
}

export interface DocumentStore {
  nodes: Ref<CanvasNodeData[]>
  mode: Ref<'free' | 'grid'>
  readonly: Ref<boolean>
  getNode: (id: string) => CanvasNodeData | undefined
  getChildren: (parentId: string | null) => CanvasNodeData[]
  getDescendants: (id: string) => CanvasNodeData[]
  getAncestors: (id: string) => CanvasNodeData[]
  getSiblings: (id: string) => CanvasNodeData[]
  replaceAll: (nodes: CanvasNodeData[]) => void
  applyNodes: (nodes: CanvasNodeData[]) => void
  toSchema: () => CanvasSchema
}

export interface SelectionStore {
  selectedIds: Ref<string[]>
  hoveredId: Ref<string | null>
  selectedNodes: ComputedRef<CanvasNodeData[]>
  select: (id: string, multi?: boolean) => void
  selectMany: (ids: string[]) => void
  selectAll: () => void
  clear: () => void
  setHover: (id: string | null) => void
  isSelected: (id: string) => boolean
}

export interface HistoryStore {
  canUndo: ComputedRef<boolean>
  canRedo: ComputedRef<boolean>
  undo: () => void
  redo: () => void
  push: (command: Command) => void
  beginTransaction: (label?: string) => void
  previewPatch: (nodes: CanvasNodeData[]) => void
  commit: (command: Command) => void
  cancelTransaction: () => void
  readonly isTransacting: ComputedRef<boolean>
}

export interface ClipboardStore {
  hasContent: ComputedRef<boolean>
  copy: (nodes: CanvasNodeData[]) => void
  paste: () => CanvasNodeData[]
  clear: () => void
}

export interface ViewportStore {
  transform: Ref<ViewportTransform>
  zoom: ComputedRef<number>
  setZoom: (zoom: number) => void
  zoomBy: (delta: number, centerScreen?: { x: number; y: number }) => void
  setPan: (x: number, y: number) => void
  panBy: (dx: number, dy: number) => void
  reset: () => void
  fit: (bounds: Rect, viewport: { width: number; height: number }, padding?: number) => void
  screenToCanvas: (screenX: number, screenY: number, rect: DOMRect) => { x: number; y: number }
  canvasToScreen: (canvasX: number, canvasY: number, rect: DOMRect) => { x: number; y: number }
}

export interface CommandManager {
  execute: (command: Command) => void
  undo: () => void
  redo: () => void
  beginTransaction: (label?: string) => void
  previewPatch: (nodes: CanvasNodeData[]) => void
  commit: (command: Command) => void
  cancelTransaction: () => void
}

export interface LowcodeEditor {
  document: DocumentStore
  selection: SelectionStore
  history: HistoryStore
  clipboard: ClipboardStore
  viewport: ViewportStore
  commands: CommandManager
  /** Convenience mirrors */
  canUndo: ComputedRef<boolean>
  canRedo: ComputedRef<boolean>
  nodes: Ref<CanvasNodeData[]>
  selectedIds: Ref<string[]>
  selectedNodes: ComputedRef<CanvasNodeData[]>
  addNode: (node: CanvasNodeData) => void
  deleteSelection: () => void
  updateNode: (id: string, patch: Partial<CanvasNodeData>) => void
  moveNode: (id: string, x: number, y: number) => void
  resizeNode: (id: string, rect: Rect) => void
  reparent: (id: string, parentId: string | null) => void
  duplicateSelection: () => void
  copySelection: () => void
  pasteClipboard: () => void
  moveBefore: (id: string, siblingId: string) => void
  moveAfter: (id: string, siblingId: string) => void
  moveInto: (id: string, parentId: string) => void
  alignSelection: (axis: AlignAxis) => void
  distributeSelection: (axis: 'horizontal' | 'vertical') => void
  dispose: () => void
}

export type AlignAxis =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom'

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se'
