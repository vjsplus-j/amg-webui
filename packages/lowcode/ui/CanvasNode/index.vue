<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCanvasEditor } from '@amg-webui/hooks'
import { resolveNodeRender } from '../../bindings'
import { type CanvasTreeNode } from '../../tree'
import { trackEmit } from '@amg-webui/telemetry'
import type { CanvasNodeProps } from './types'
import './style.scss'

defineOptions({ name: 'CanvasNode' })

const props = withDefaults(defineProps<CanvasNodeProps>(), {
  selectable: true,
  draggable: true,
  keyboardStep: 1,
  renderMode: 'chrome',
  nested: false,
  children: () => [],
  telemetry: undefined
})

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'move', payload: { id: string; x: number; y: number }): void
  (e: 'moveStart', payload: { id: string; x: number; y: number }): void
  (e: 'moveEnd', payload: { id: string; x: number; y: number }): void
}>()
const editor = useCanvasEditor()

const dragging = ref(false)
const start = ref({ x: 0, y: 0, nx: 0, ny: 0 })

const selected = computed(
  () => editor?.selectedIds.value.includes(props.node.id) ?? false
)

const render = computed(() => resolveNodeRender(props.node, props.registry))
const showComponent = computed(
  () => props.renderMode === 'component' && Boolean(render.value.component)
)

const childTree = computed(() => props.children as CanvasTreeNode[])

const style = computed(() => {
  if (props.nested) {
    return {
      position: 'relative' as const,
      left: 'auto',
      top: 'auto',
      width: `${props.node.w}px`,
      minHeight: `${props.node.h}px`,
      zIndex: String(props.node.zIndex ?? 1)
    }
  }
  return {
    left: `${props.node.x}px`,
    top: `${props.node.y}px`,
    width: `${props.node.w}px`,
    minHeight: `${props.node.h}px`,
    zIndex: String(props.node.zIndex ?? 1)
  }
})

const rootClass = computed(() => [
  'vp-canvas-node',
  {
    'vp-canvas-node--selected': selected.value,
    'vp-canvas-node--locked': props.node.locked,
    'vp-canvas-node--hidden': props.node.hidden,
    'vp-canvas-node--component': showComponent.value,
    'vp-canvas-node--nested': props.nested,
    'vp-canvas-node--host': childTree.value.length > 0
  }
])

function onClick(e: MouseEvent) {
  if (!props.selectable) return
  e.stopPropagation()
  editor?.selectNode(props.node.id, e.shiftKey)
  emit('select', props.node.id)
}

function onPointerDown(e: PointerEvent) {
  // Nested nodes stay in parent flow — no free-canvas drag (avoids pile-up).
  if (props.nested || !props.draggable || !editor || editor.readonly.value || props.node.locked) {
    return
  }
  const target = e.target as HTMLElement | null
  if (target?.closest('input, textarea, select, button, a, [contenteditable="true"]')) {
    return
  }
  dragging.value = true
  start.value = {
    x: e.clientX,
    y: e.clientY,
    nx: props.node.x,
    ny: props.node.y
  }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  emit('moveStart', { id: props.node.id, x: props.node.x, y: props.node.y })
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || !editor) return
  const x = start.value.nx + (e.clientX - start.value.x)
  const y = start.value.ny + (e.clientY - start.value.y)
  editor.updateNode(props.node.id, { x, y })
  emit('move', { id: props.node.id, x, y })
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value) return
  dragging.value = false
  ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  emit('moveEnd', { id: props.node.id, x: props.node.x, y: props.node.y })
  trackEmit({
    component: 'CanvasNode',
    type: 'moveEnd',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { id: props.node.id, x: props.node.x, y: props.node.y }
  })
}

function onKeydown(e: KeyboardEvent) {
  if (!props.selectable) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    editor?.selectNode(props.node.id, e.shiftKey)
    emit('select', props.node.id)
    return
  }
  if (props.nested || !props.draggable || !editor || editor.readonly.value || props.node.locked) {
    return
  }
  const delta = (e.shiftKey ? 10 : 1) * props.keyboardStep
  let x = props.node.x
  let y = props.node.y
  if (e.key === 'ArrowLeft') x -= delta
  else if (e.key === 'ArrowRight') x += delta
  else if (e.key === 'ArrowUp') y -= delta
  else if (e.key === 'ArrowDown') y += delta
  else return
  e.preventDefault()
  editor.updateNode(props.node.id, { x, y })
  emit('move', { id: props.node.id, x, y })
}
</script>

<template>
  <div
    :class="[rootClass, props.class]"
    :style="[style, props.style]"
    data-component="CanvasNode"
    role="button"
    :tabindex="selectable ? 0 : -1"
    :aria-pressed="selected"
    :aria-label="node.label"
    @click="onClick"
    @keydown="onKeydown"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <slot :node="node" :selected="selected" :render="render">
      <component
        :is="render.component"
        v-if="showComponent"
        v-bind="render.props"
        class="vp-canvas-node__mount"
      />
      <template v-else>
        <span class="vp-canvas-node__label">{{ node.label }}</span>
        <span class="vp-canvas-node__type">{{ node.type }}</span>
      </template>
    </slot>
    <div v-if="childTree.length" class="vp-canvas-node__children">
      <CanvasNode
        v-for="child in childTree"
        :key="child.id"
        :node="child"
        :children="child.children"
        nested
        :selectable="selectable"
        :draggable="draggable"
        :keyboard-step="keyboardStep"
        :registry="registry"
        :render-mode="renderMode"
        :track-id="trackId"
        :telemetry="telemetry"
        @select="emit('select', $event)"
      />
    </div>
  </div>
</template>
