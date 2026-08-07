<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { createCanvasNode, type CanvasNodeData } from '@amg-webui/utils'
import {
  applyResizeHandle,
  hitTestNodes,
  nodesInMarquee,
  snapPosition,
  type LowcodeEditor,
  type ResizeHandle
} from '../editor'
import { resolveNodeRender } from '../bindings'
import type { ComponentRegistry } from '../types'
import type { LowcodeMaterial } from '../materials'
import { canDropMaterial } from '../materials'
import './studio.scss'

const props = defineProps<{
  editor: LowcodeEditor
  registry: ComponentRegistry
  materials: LowcodeMaterial[]
  preview?: boolean
}>()

const surfaceRef = ref<HTMLElement | null>(null)
const guides = ref<{ orientation: 'h' | 'v'; position: number; distance?: number }[]>([])
const marquee = ref<{ x: number; y: number; w: number; h: number } | null>(null)
const spaceDown = ref(false)
const panning = ref(false)
const dropParentId = ref<string | null>(null)

type DragState = {
  id: string
  startX: number
  startY: number
  origX: number
  origY: number
}
type ResizeState = {
  id: string
  handle: ResizeHandle
  start: { x: number; y: number; w: number; h: number }
  pointerX: number
  pointerY: number
}

let dragState: DragState | null = null
let resizeState: ResizeState | null = null
let panStart: { x: number; y: number; panX: number; panY: number } | null = null
let marqueeStart: { x: number; y: number } | null = null

/** Absolute rects for hit-test / guides (parent-local → canvas). */
const absoluteMap = computed(() => {
  const map = new Map<string, { x: number; y: number; w: number; h: number }>()
  const byId = new Map(props.editor.nodes.value.map((n) => [n.id, n]))
  const absOf = (id: string): { x: number; y: number } => {
    const n = byId.get(id)
    if (!n) return { x: 0, y: 0 }
    if (!n.parentId || !byId.has(n.parentId)) return { x: n.x, y: n.y }
    const p = absOf(n.parentId)
    return { x: p.x + n.x, y: p.y + n.y }
  }
  for (const n of props.editor.nodes.value) {
    const p = absOf(n.id)
    map.set(n.id, { x: p.x, y: p.y, w: n.w, h: n.h })
  }
  return map
})

const flatForHit = computed(() =>
  props.editor.nodes.value.map((n) => {
    const a = absoluteMap.value.get(n.id)!
    return { ...n, x: a.x, y: a.y }
  })
)

const transformStyle = computed(() => {
  const t = props.editor.viewport.transform.value
  return {
    transform: `translate(${t.panX}px, ${t.panY}px) scale(${t.zoom})`,
    transformOrigin: '0 0'
  }
})

function materialOf(type: string) {
  return props.materials.find((m) => m.type === type)
}

function getCanvasPoint(e: PointerEvent | MouseEvent | DragEvent) {
  const el = surfaceRef.value
  if (!el) return { x: 0, y: 0 }
  return props.editor.viewport.screenToCanvas(e.clientX, e.clientY, el.getBoundingClientRect())
}

function onWheel(e: WheelEvent) {
  if (!e.ctrlKey && !e.metaKey) return
  e.preventDefault()
  const el = surfaceRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  props.editor.viewport.zoomBy(e.deltaY > 0 ? -0.08 : 0.08, {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  })
}

function onKeyDown(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return
  if (e.code === 'Space') {
    spaceDown.value = true
    e.preventDefault()
  }
  const mod = e.metaKey || e.ctrlKey
  if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) {
    e.preventDefault()
    props.editor.commands.undo()
  } else if (mod && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
    e.preventDefault()
    props.editor.commands.redo()
  } else if (mod && e.key.toLowerCase() === 'c') {
    e.preventDefault()
    props.editor.copySelection()
  } else if (mod && e.key.toLowerCase() === 'v') {
    e.preventDefault()
    props.editor.pasteClipboard()
  } else if (mod && e.key.toLowerCase() === 'a') {
    e.preventDefault()
    props.editor.selection.selectAll()
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault()
    props.editor.deleteSelection()
  }
}

function onKeyUp(e: KeyboardEvent) {
  if (e.code === 'Space') spaceDown.value = false
}

function onPointerDown(e: PointerEvent) {
  if (props.preview) return
  const el = surfaceRef.value
  if (!el) return
  if (spaceDown.value || e.button === 1) {
    panning.value = true
    panStart = {
      x: e.clientX,
      y: e.clientY,
      panX: props.editor.viewport.transform.value.panX,
      panY: props.editor.viewport.transform.value.panY
    }
    el.setPointerCapture(e.pointerId)
    return
  }
  const pt = getCanvasPoint(e)
  const hit = hitTestNodes(flatForHit.value, pt.x, pt.y)
  if (!hit) {
    if (!e.shiftKey) props.editor.selection.clear()
    marqueeStart = pt
    marquee.value = { x: pt.x, y: pt.y, w: 0, h: 0 }
    el.setPointerCapture(e.pointerId)
    return
  }
  props.editor.selection.select(hit.id, e.shiftKey)
  if (hit.locked) return
  const local = props.editor.nodes.value.find((n) => n.id === hit.id)!
  props.editor.commands.beginTransaction('MoveNode')
  dragState = {
    id: hit.id,
    startX: pt.x,
    startY: pt.y,
    origX: local.x,
    origY: local.y
  }
  el.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (panning.value && panStart) {
    props.editor.viewport.setPan(
      panStart.panX + (e.clientX - panStart.x),
      panStart.panY + (e.clientY - panStart.y)
    )
    return
  }
  const pt = getCanvasPoint(e)
  if (marqueeStart) {
    marquee.value = {
      x: Math.min(marqueeStart.x, pt.x),
      y: Math.min(marqueeStart.y, pt.y),
      w: Math.abs(pt.x - marqueeStart.x),
      h: Math.abs(pt.y - marqueeStart.y)
    }
    return
  }
  if (resizeState) {
    const dx = pt.x - resizeState.pointerX
    const dy = pt.y - resizeState.pointerY
    let rect = applyResizeHandle(resizeState.start, resizeState.handle, dx, dy, {
      lockAspect: e.shiftKey,
      center: e.altKey
    })
    const others = flatForHit.value.filter((n) => n.id !== resizeState!.id)
    const snapped = snapPosition(rect, others)
    rect = { ...rect, x: snapped.x, y: snapped.y }
    guides.value = snapped.guides
    // Convert absolute resize back to local if nested
    const node = props.editor.nodes.value.find((n) => n.id === resizeState!.id)!
    let localX = rect.x
    let localY = rect.y
    if (node.parentId) {
      const parentAbs = absoluteMap.value.get(node.parentId)
      if (parentAbs) {
        localX = rect.x - parentAbs.x
        localY = rect.y - parentAbs.y
      }
    }
    props.editor.commands.previewPatch(
      props.editor.nodes.value.map((n) =>
        n.id === resizeState!.id ? { ...n, x: localX, y: localY, w: rect.w, h: rect.h } : n
      )
    )
    return
  }
  if (dragState) {
    const node = props.editor.nodes.value.find((n) => n.id === dragState!.id)
    if (!node) return
    const dx = pt.x - dragState.startX
    const dy = pt.y - dragState.startY
    let nextX = dragState.origX + dx
    let nextY = dragState.origY + dy
    // Snap in absolute space
    const abs = absoluteMap.value.get(node.id)!
    const draftAbs = {
      x: abs.x - node.x + nextX,
      y: abs.y - node.y + nextY,
      w: node.w,
      h: node.h
    }
    const others = flatForHit.value.filter((n) => n.id !== node.id)
    const snapped = snapPosition(draftAbs, others)
    guides.value = snapped.guides
    nextX = node.x + (snapped.x - abs.x)
    nextY = node.y + (snapped.y - abs.y)
    props.editor.commands.previewPatch(
      props.editor.nodes.value.map((n) =>
        n.id === node.id ? { ...n, x: nextX, y: nextY } : n
      )
    )
  }
}

function onPointerUp(e: PointerEvent) {
  try {
    surfaceRef.value?.releasePointerCapture(e.pointerId)
  } catch {
    /* ignore */
  }
  if (panning.value) {
    panning.value = false
    panStart = null
    return
  }
  if (marqueeStart && marquee.value) {
    const ids = nodesInMarquee(flatForHit.value, marquee.value)
    if (ids.length) props.editor.selection.selectMany(ids)
    marqueeStart = null
    marquee.value = null
    return
  }
  if (resizeState) {
    const final = props.editor.nodes.value.find((n) => n.id === resizeState!.id)
    const id = resizeState.id
    const rect = final
      ? { x: final.x, y: final.y, w: final.w, h: final.h }
      : resizeState.start
    props.editor.commands.cancelTransaction()
    props.editor.resizeNode(id, rect)
    resizeState = null
    guides.value = []
    return
  }
  if (dragState) {
    const final = props.editor.nodes.value.find((n) => n.id === dragState!.id)
    const id = dragState.id
    const x = final?.x ?? dragState.origX
    const y = final?.y ?? dragState.origY
    props.editor.commands.cancelTransaction()
    props.editor.moveNode(id, x, y)
    dragState = null
    guides.value = []
  }
}

function startResize(e: PointerEvent, id: string, handle: ResizeHandle) {
  e.stopPropagation()
  e.preventDefault()
  if (props.preview) return
  const node = props.editor.nodes.value.find((n) => n.id === id)
  if (!node || node.locked) return
  const abs = absoluteMap.value.get(id)!
  const pt = getCanvasPoint(e)
  props.editor.selection.select(id)
  props.editor.commands.beginTransaction('ResizeNode')
  resizeState = {
    id,
    handle,
    start: { x: abs.x, y: abs.y, w: node.w, h: node.h },
    pointerX: pt.x,
    pointerY: pt.y
  }
  surfaceRef.value?.setPointerCapture(e.pointerId)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  if (props.preview) return
  const pt = getCanvasPoint(e)
  const hit = hitTestNodes(flatForHit.value, pt.x, pt.y)
  const childType = e.dataTransfer?.getData('application/vp-material-type') || ''
  if (hit) {
    const mat = materialOf(hit.type)
    if (mat && (canDropMaterial(mat, childType || '*') || mat.isContainer)) {
      dropParentId.value = hit.id
      return
    }
  }
  dropParentId.value = null
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  if (props.preview) return
  const type = e.dataTransfer?.getData('application/vp-material-type')
  if (!type) return
  const mat = materialOf(type)
  const meta = props.registry.get(type)
  const pt = getCanvasPoint(e)
  let parentId: string | null = dropParentId.value
  if (parentId) {
    const parent = props.editor.nodes.value.find((n) => n.id === parentId)
    const parentMat = parent ? materialOf(parent.type) : null
    if (!canDropMaterial(parentMat, type) && !parentMat?.isContainer) parentId = null
  }
  let x = pt.x - 20
  let y = pt.y - 20
  if (parentId) {
    const parentAbs = absoluteMap.value.get(parentId)
    if (parentAbs) {
      x = Math.max(8, pt.x - parentAbs.x - 20)
      y = Math.max(8, pt.y - parentAbs.y - 20)
    }
  }
  const node = createCanvasNode(type, mat?.title || meta?.label || type, {
    x,
    y,
    w: mat?.defaultSize?.w ?? meta?.defaultSize?.w,
    h: mat?.defaultSize?.h ?? meta?.defaultSize?.h,
    parentId,
    props: { ...(mat?.defaultProps ?? meta?.defaultProps ?? {}) }
  })
  props.editor.addNode(node)
  dropParentId.value = null
}

function renderProps(node: CanvasNodeData) {
  return resolveNodeRender(node, props.registry).props
}

function compOf(node: CanvasNodeData) {
  return resolveNodeRender(node, props.registry).component
}

const handles: ResizeHandle[] = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
})
</script>

<template>
  <div
    ref="surfaceRef"
    class="vp-studio-canvas"
    :class="{ 'is-panning': panning || spaceDown, 'is-preview': preview }"
    @wheel="onWheel"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <div class="vp-studio-canvas__world" :style="transformStyle">
      <div class="vp-studio-canvas__grid" />

      <div
        v-for="node in editor.nodes.value"
        :key="node.id"
        class="vp-studio-node"
        :class="{
          'is-selected': editor.selection.isSelected(node.id),
          'is-drop-target': dropParentId === node.id,
          'is-locked': node.locked
        }"
        :style="{
          left: (absoluteMap.get(node.id)?.x ?? node.x) + 'px',
          top: (absoluteMap.get(node.id)?.y ?? node.y) + 'px',
          width: node.w + 'px',
          height: node.h + 'px',
          zIndex: node.zIndex ?? 1,
          display: node.hidden ? 'none' : undefined
        }"
        :data-node-id="node.id"
      >
        <div class="vp-studio-node__body">
          <component :is="compOf(node)" v-bind="renderProps(node)" class="vp-studio-node__comp" />
        </div>
        <template v-if="!preview && editor.selection.isSelected(node.id) && !node.locked">
          <span
            v-for="h in handles"
            :key="h"
            class="vp-studio-handle"
            :class="`vp-studio-handle--${h}`"
            @pointerdown="startResize($event, node.id, h)"
          />
        </template>
      </div>

      <div
        v-for="(g, i) in guides"
        :key="'g' + i"
        class="vp-studio-guide"
        :class="g.orientation === 'v' ? 'is-v' : 'is-h'"
        :style="g.orientation === 'v' ? { left: g.position + 'px' } : { top: g.position + 'px' }"
      >
        <span v-if="g.distance != null" class="vp-studio-guide__dist">{{ g.distance }}</span>
      </div>

      <div
        v-if="marquee"
        class="vp-studio-marquee"
        :style="{
          left: marquee.x + 'px',
          top: marquee.y + 'px',
          width: marquee.w + 'px',
          height: marquee.h + 'px'
        }"
      />
    </div>
  </div>
</template>
