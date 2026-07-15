<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCanvasEditor } from '@amg-webui/hooks'
import type { CanvasNodeProps, CanvasNodeEmits } from './types'
import './style.scss'

const props = defineProps<CanvasNodeProps>()
const emit = defineEmits<CanvasNodeEmits>()
const editor = useCanvasEditor()

const dragging = ref(false)
const start = ref({ x: 0, y: 0, nx: 0, ny: 0 })

const selected = computed(() => editor?.selectedIds.value.includes(props.node.id) ?? false)

const style = computed(() => ({
  left: `${props.node.x}px`,
  top: `${props.node.y}px`,
  width: `${props.node.w}px`,
  minHeight: `${props.node.h}px`,
  zIndex: String(props.node.zIndex ?? 1)
}))

function onClick(e: MouseEvent) {
  e.stopPropagation()
  editor?.selectNode(props.node.id, e.shiftKey)
  emit('select', props.node.id)
}

function onPointerDown(e: PointerEvent) {
  if (!editor || editor.readonly.value || props.node.locked) return
  dragging.value = true
  start.value = { x: e.clientX, y: e.clientY, nx: props.node.x, ny: props.node.y }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || !editor) return
  editor.updateNode(props.node.id, {
    x: start.value.nx + (e.clientX - start.value.x),
    y: start.value.ny + (e.clientY - start.value.y)
  })
}

function onPointerUp(e: PointerEvent) {
  dragging.value = false
  ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
}
</script>

<template>
  <div
    :class="['vp-canvas-node', { 'vp-canvas-node--selected': selected, 'vp-canvas-node--locked': node.locked }]"
    :style="style"
    data-component="CanvasNode"
    @click="onClick"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <span class="vp-canvas-node__label">{{ node.label }}</span>
    <span class="vp-canvas-node__type">{{ node.type }}</span>
    <slot />
  </div>
</template>
