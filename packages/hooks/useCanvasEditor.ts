import {
  inject,
  provide,
  ref,
  computed,
  type InjectionKey,
  type Ref,
  type ComputedRef
} from 'vue'
import { cloneDeep } from '@amg-webui/utils'
import type { CanvasNodeData } from '@amg-webui/utils/canvasSchema'
import { wouldCreateCycle } from '@amg-webui/lowcode'

export interface CanvasEditorContext {
  nodes: Ref<CanvasNodeData[]>
  selectedIds: Ref<string[]>
  mode: Ref<'free' | 'grid'>
  readonly: Ref<boolean>
  selectedNodes: ComputedRef<CanvasNodeData[]>
  canUndo: ComputedRef<boolean>
  canRedo: ComputedRef<boolean>
  selectNode: (id: string, multi?: boolean) => void
  clearSelection: () => void
  updateNode: (id: string, patch: Partial<CanvasNodeData>, recordHistory?: boolean) => void
  removeNodes: (ids: string[]) => void
  addNode: (node: CanvasNodeData) => void
  moveNodeLayer: (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => void
  undo: () => void
  redo: () => void
  copySelection: () => void
  pasteClipboard: () => void
  replaceNodes: (nodes: CanvasNodeData[], pushHistory?: boolean) => void
  /** Reparent node; no-ops when cycle would form. */
  setParent: (id: string, parentId: string | null) => void
  beginTransaction: () => void
  previewTransaction: (nodes: CanvasNodeData[]) => void
  commitTransaction: () => void
  cancelTransaction: () => void
}

export const CanvasEditorKey: InjectionKey<CanvasEditorContext> = Symbol('vp-canvas-editor')

export interface ProvideCanvasEditorOptions {
  nodes: Ref<CanvasNodeData[]>
  mode?: Ref<'free' | 'grid'>
  readonly?: Ref<boolean>
  historyLimit?: number
  onChange?: () => void
}

function snapshot(nodes: CanvasNodeData[]): CanvasNodeData[] {
  return cloneDeep(nodes)
}

export function provideCanvasEditor(options: ProvideCanvasEditorOptions): CanvasEditorContext {
  const selectedIds = ref<string[]>([])
  const mode = options.mode ?? ref<'free' | 'grid'>('free')
  const readonly = options.readonly ?? ref(false)
  const historyLimit = options.historyLimit ?? 50
  const past = ref<CanvasNodeData[][]>([snapshot(options.nodes.value)])
  const future = ref<CanvasNodeData[][]>([])
  const clipboard = ref<CanvasNodeData[]>([])
  let applyingHistory = false

  const selectedNodes = computed(() =>
    options.nodes.value.filter((n) => selectedIds.value.includes(n.id))
  )

  const canUndo = computed(() => past.value.length > 1)
  const canRedo = computed(() => future.value.length > 0)

  const touch = () => options.onChange?.()

  const pushHistory = () => {
    if (applyingHistory) return
    past.value = [...past.value, snapshot(options.nodes.value)].slice(-historyLimit)
    future.value = []
  }

  const selectNode = (id: string, multi = false) => {
    if (readonly.value) return
    if (multi) {
      const set = new Set(selectedIds.value)
      if (set.has(id)) set.delete(id)
      else set.add(id)
      selectedIds.value = [...set]
    } else {
      selectedIds.value = [id]
    }
  }

  const clearSelection = () => {
    selectedIds.value = []
  }

  const replaceNodes = (nodes: CanvasNodeData[], recordHistory = true) => {
    options.nodes.value = snapshot(nodes)
    if (recordHistory) pushHistory()
    touch()
  }

  const updateNode = (id: string, patch: Partial<CanvasNodeData>, recordHistory = true) => {
    const idx = options.nodes.value.findIndex((n) => n.id === id)
    if (idx < 0) return
    const prev = options.nodes.value[idx]!
    const next: CanvasNodeData = {
      ...prev,
      ...patch,
      props: patch.props ? { ...patch.props } : prev.props
    }
    options.nodes.value = options.nodes.value.map((n, i) => (i === idx ? next : n))
    if (recordHistory) pushHistory()
    touch()
  }

  /** Begin a drag/resize transaction — only one undo on endTransaction. */
  let txBaseline: CanvasNodeData[] | null = null
  const beginTransaction = () => {
    if (txBaseline) return
    txBaseline = snapshot(options.nodes.value)
  }
  const previewTransaction = (nodes: CanvasNodeData[]) => {
    if (!txBaseline) return
    options.nodes.value = snapshot(nodes)
    touch()
  }
  const commitTransaction = () => {
    if (!txBaseline) return
    txBaseline = null
    pushHistory()
    touch()
  }
  const cancelTransaction = () => {
    if (!txBaseline) return
    options.nodes.value = snapshot(txBaseline)
    txBaseline = null
    touch()
  }

  const removeNodes = (ids: string[]) => {
    if (readonly.value) return
    const set = new Set(ids)
    options.nodes.value = options.nodes.value.filter((n) => !set.has(n.id))
    selectedIds.value = selectedIds.value.filter((id) => !set.has(id))
    pushHistory()
    touch()
  }

  const addNode = (node: CanvasNodeData) => {
    if (readonly.value) return
    options.nodes.value = [...options.nodes.value, cloneDeep(node)]
    pushHistory()
    touch()
  }

  const moveNodeLayer = (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => {
    const list = [...options.nodes.value]
    const idx = list.findIndex((n) => n.id === id)
    if (idx < 0) return
    const [item] = list.splice(idx, 1)
    if (dir === 'top') list.push(item)
    else if (dir === 'bottom') list.unshift(item)
    else if (dir === 'up' && idx < list.length) list.splice(idx + 1, 0, item)
    else if (dir === 'down' && idx > 0) list.splice(idx - 1, 0, item)
    else list.splice(idx, 0, item)
    options.nodes.value = list.map((n, i) => ({ ...n, zIndex: i + 1 }))
    pushHistory()
    touch()
  }

  const undo = () => {
    if (past.value.length <= 1) return
    const current = past.value[past.value.length - 1]
    const previous = past.value[past.value.length - 2]
    future.value = [current, ...future.value]
    past.value = past.value.slice(0, -1)
    applyingHistory = true
    options.nodes.value = snapshot(previous)
    applyingHistory = false
    touch()
  }

  const redo = () => {
    if (!future.value.length) return
    const [next, ...rest] = future.value
    future.value = rest
    past.value = [...past.value, snapshot(next)]
    applyingHistory = true
    options.nodes.value = snapshot(next)
    applyingHistory = false
    touch()
  }

  const copySelection = () => {
    clipboard.value = snapshot(selectedNodes.value)
  }

  const pasteClipboard = () => {
    if (readonly.value || !clipboard.value.length) return
    const offset = 16
    const clones = clipboard.value.map((n) => ({
      ...cloneDeep(n),
      id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      x: n.x + offset,
      y: n.y + offset
    }))
    options.nodes.value = [...options.nodes.value, ...clones]
    selectedIds.value = clones.map((n) => n.id)
    pushHistory()
    touch()
  }

  const setParent = (id: string, parentId: string | null) => {
    if (readonly.value) return
    if (wouldCreateCycle(options.nodes.value, id, parentId)) return
    updateNode(id, { parentId })
  }

  const ctx: CanvasEditorContext = {
    nodes: options.nodes,
    selectedIds,
    mode,
    readonly,
    selectedNodes,
    canUndo,
    canRedo,
    selectNode,
    clearSelection,
    updateNode,
    removeNodes,
    addNode,
    moveNodeLayer,
    undo,
    redo,
    copySelection,
    pasteClipboard,
    replaceNodes,
    setParent,
    beginTransaction,
    previewTransaction,
    commitTransaction,
    cancelTransaction
  }

  provide(CanvasEditorKey, ctx)
  return ctx
}

export function useCanvasEditor(): CanvasEditorContext | undefined {
  return inject(CanvasEditorKey, undefined)
}
