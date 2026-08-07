import { computed, ref, type Ref } from 'vue'
import type { CanvasNodeData } from '@amg-webui/utils'
import type { Command, HistoryStore, ViewportStore, ViewportTransform, Rect } from './types'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 4

function clampZoom(z: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))
}

export function createHistoryStore(
  applyNodes: (nodes: CanvasNodeData[]) => void,
  getNodes: () => CanvasNodeData[],
  historyLimit = 100,
  onChange?: () => void
): HistoryStore {
  const past = ref<Command[]>([])
  const future = ref<Command[]>([])
  const transacting = ref(false)
  const transactionBaseline = ref<CanvasNodeData[] | null>(null)
  const transactionLabel = ref('Transaction')

  const canUndo = computed(() => past.value.length > 0)
  const canRedo = computed(() => future.value.length > 0)
  const isTransacting = computed(() => transacting.value)

  const push = (command: Command) => {
    if (transacting.value) return
    command.execute()
    past.value = [...past.value, command].slice(-historyLimit)
    future.value = []
    onChange?.()
  }

  const undo = () => {
    if (transacting.value || !past.value.length) return
    const cmd = past.value[past.value.length - 1]!
    cmd.undo()
    past.value = past.value.slice(0, -1)
    future.value = [cmd, ...future.value]
    onChange?.()
  }

  const redo = () => {
    if (transacting.value || !future.value.length) return
    const [cmd, ...rest] = future.value
    cmd!.redo()
    future.value = rest
    past.value = [...past.value, cmd!]
    onChange?.()
  }

  const beginTransaction = (label = 'Transaction') => {
    if (transacting.value) return
    transacting.value = true
    transactionLabel.value = label
    transactionBaseline.value = getNodes().map((n) => ({ ...n, props: { ...n.props } }))
  }

  const previewPatch = (nodes: CanvasNodeData[]) => {
    if (!transacting.value) return
    applyNodes(nodes)
  }

  const commit = (command: Command) => {
    if (!transacting.value) {
      push(command)
      return
    }
    // Restore baseline then execute so undo snapshot is consistent
    if (transactionBaseline.value) applyNodes(transactionBaseline.value)
    transacting.value = false
    transactionBaseline.value = null
    command.execute()
    past.value = [...past.value, command].slice(-historyLimit)
    future.value = []
    onChange?.()
  }

  const cancelTransaction = () => {
    if (!transacting.value) return
    if (transactionBaseline.value) applyNodes(transactionBaseline.value)
    transacting.value = false
    transactionBaseline.value = null
  }

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    push,
    beginTransaction,
    previewPatch,
    commit,
    cancelTransaction,
    isTransacting
  }
}

export function createViewportStore(
  initial?: Partial<ViewportTransform>
): ViewportStore {
  const transform = ref<ViewportTransform>({
    zoom: initial?.zoom ?? 1,
    panX: initial?.panX ?? 0,
    panY: initial?.panY ?? 0
  })

  const zoom = computed(() => transform.value.zoom)

  const setZoom = (z: number) => {
    transform.value = { ...transform.value, zoom: clampZoom(z) }
  }

  const zoomBy = (delta: number, centerScreen?: { x: number; y: number }) => {
    const prev = transform.value.zoom
    const next = clampZoom(prev + delta)
    if (!centerScreen) {
      setZoom(next)
      return
    }
    // Keep canvas point under cursor stable
    const ratio = next / prev
    transform.value = {
      zoom: next,
      panX: centerScreen.x - (centerScreen.x - transform.value.panX) * ratio,
      panY: centerScreen.y - (centerScreen.y - transform.value.panY) * ratio
    }
  }

  const setPan = (x: number, y: number) => {
    transform.value = { ...transform.value, panX: x, panY: y }
  }

  const panBy = (dx: number, dy: number) => {
    transform.value = {
      ...transform.value,
      panX: transform.value.panX + dx,
      panY: transform.value.panY + dy
    }
  }

  const reset = () => {
    transform.value = { zoom: 1, panX: 0, panY: 0 }
  }

  const fit = (
    bounds: Rect,
    viewport: { width: number; height: number },
    padding = 48
  ) => {
    const bw = Math.max(bounds.w, 1)
    const bh = Math.max(bounds.h, 1)
    const zw = (viewport.width - padding * 2) / bw
    const zh = (viewport.height - padding * 2) / bh
    const z = clampZoom(Math.min(zw, zh, 1))
    transform.value = {
      zoom: z,
      panX: padding - bounds.x * z + (viewport.width - padding * 2 - bw * z) / 2,
      panY: padding - bounds.y * z + (viewport.height - padding * 2 - bh * z) / 2
    }
  }

  const screenToCanvas = (screenX: number, screenY: number, rect: DOMRect) => {
    const localX = screenX - rect.left
    const localY = screenY - rect.top
    return {
      x: (localX - transform.value.panX) / transform.value.zoom,
      y: (localY - transform.value.panY) / transform.value.zoom
    }
  }

  const canvasToScreen = (canvasX: number, canvasY: number, rect: DOMRect) => ({
    x: rect.left + canvasX * transform.value.zoom + transform.value.panX,
    y: rect.top + canvasY * transform.value.zoom + transform.value.panY
  })

  return {
    transform: transform as Ref<ViewportTransform>,
    zoom,
    setZoom,
    zoomBy,
    setPan,
    panBy,
    reset,
    fit,
    screenToCanvas,
    canvasToScreen
  }
}
