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

export interface CanvasEditorContext {
  nodes: Ref<CanvasNodeData[]>
  selectedIds: Ref<string[]>
  mode: Ref<'free' | 'grid'>
  readonly: Ref<boolean>
  selectedNodes: ComputedRef<CanvasNodeData[]>
  selectNode: (id: string, multi?: boolean) => void
  clearSelection: () => void
  updateNode: (id: string, patch: Partial<CanvasNodeData>) => void
  removeNodes: (ids: string[]) => void
  addNode: (node: CanvasNodeData) => void
  moveNodeLayer: (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => void
}

export const CanvasEditorKey: InjectionKey<CanvasEditorContext> = Symbol('vp-canvas-editor')

export interface ProvideCanvasEditorOptions {
  nodes: Ref<CanvasNodeData[]>
  mode?: Ref<'free' | 'grid'>
  readonly?: Ref<boolean>
  onChange?: () => void
}

export function provideCanvasEditor(options: ProvideCanvasEditorOptions): CanvasEditorContext {
  const selectedIds = ref<string[]>([])
  const mode = options.mode ?? ref<'free' | 'grid'>('free')
  const readonly = options.readonly ?? ref(false)

  const selectedNodes = computed(() =>
    options.nodes.value.filter((n) => selectedIds.value.includes(n.id))
  )

  const touch = () => options.onChange?.()

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

  const updateNode = (id: string, patch: Partial<CanvasNodeData>) => {
    const idx = options.nodes.value.findIndex((n) => n.id === id)
    if (idx < 0) return
    options.nodes.value[idx] = { ...options.nodes.value[idx], ...patch }
    touch()
  }

  const removeNodes = (ids: string[]) => {
    if (readonly.value) return
    const set = new Set(ids)
    options.nodes.value = options.nodes.value.filter((n) => !set.has(n.id))
    selectedIds.value = selectedIds.value.filter((id) => !set.has(id))
    touch()
  }

  const addNode = (node: CanvasNodeData) => {
    if (readonly.value) return
    options.nodes.value = [...options.nodes.value, cloneDeep(node)]
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
    touch()
  }

  const ctx: CanvasEditorContext = {
    nodes: options.nodes,
    selectedIds,
    mode,
    readonly,
    selectedNodes,
    selectNode,
    clearSelection,
    updateNode,
    removeNodes,
    addNode,
    moveNodeLayer
  }

  provide(CanvasEditorKey, ctx)
  return ctx
}

export function useCanvasEditor(): CanvasEditorContext | undefined {
  return inject(CanvasEditorKey, undefined)
}
