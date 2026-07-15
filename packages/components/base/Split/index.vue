<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import type { SplitProps, SplitEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<SplitProps>(), {
  direction: 'horizontal',
  min: 48,
  size: '50%'
})

const emit = defineEmits<SplitEmits>()

const rootRef = ref<HTMLElement | null>(null)
const currentSize = ref(props.size)
const dragging = ref(false)

const isHorizontal = computed(() => props.direction === 'horizontal')

const firstPaneStyle = computed(() => {
  const size = currentSize.value
  if (isHorizontal.value) {
    return { width: typeof size === 'number' ? `${size}px` : size }
  }
  return { height: typeof size === 'number' ? `${size}px` : size }
})

function parseSizeToPx(containerSize: number): number {
  const size = currentSize.value
  if (typeof size === 'number') return size
  if (typeof size === 'string' && size.endsWith('%')) {
    return (containerSize * parseFloat(size)) / 100
  }
  return parseFloat(size) || containerSize / 2
}

function clamp(value: number, containerSize: number): number {
  const min = props.min ?? 0
  const max = props.max ?? containerSize - min
  return Math.max(min, Math.min(max, value))
}

let startPos = 0
let startSize = 0

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || !rootRef.value) return
  const rect = rootRef.value.getBoundingClientRect()
  const containerSize = isHorizontal.value ? rect.width : rect.height
  const delta = isHorizontal.value ? e.clientX - startPos : e.clientY - startPos
  const next = clamp(startSize + delta, containerSize)
  currentSize.value = next
  emit('update:size', next)
}

function onPointerUp() {
  dragging.value = false
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

function onSashPointerDown(e: PointerEvent) {
  if (!rootRef.value) return
  e.preventDefault()
  dragging.value = true
  startPos = isHorizontal.value ? e.clientX : e.clientY
  const rect = rootRef.value.getBoundingClientRect()
  const containerSize = isHorizontal.value ? rect.width : rect.height
  startSize = parseSizeToPx(containerSize)
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
  document.body.style.cursor = isHorizontal.value ? 'col-resize' : 'row-resize'
  document.body.style.userSelect = 'none'
}

onUnmounted(() => {
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})

const rootClass = computed(() => [
  'vp-split',
  `vp-split--${props.direction}`,
  props.class
])
</script>

<template>
  <div ref="rootRef" :class="rootClass" :style="style">
    <div class="vp-split__pane vp-split__pane--first" :style="firstPaneStyle">
      <slot name="first">
        <slot />
      </slot>
    </div>
    <div
      class="vp-split__sash"
      :class="{ 'vp-split__sash--active': dragging }"
      role="separator"
      :aria-orientation="direction"
      @pointerdown="onSashPointerDown"
    />
    <div class="vp-split__pane vp-split__pane--second">
      <slot name="second" />
    </div>
  </div>
</template>
