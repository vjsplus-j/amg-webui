<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import type { ResizeBoxProps, ResizeBoxEmits, ResizeDirection } from './types'
import './style.scss'

const props = withDefaults(defineProps<ResizeBoxProps>(), {
  width: '100%',
  height: 'auto',
  minWidth: 120,
  minHeight: 80,
  directions: () => ['right', 'bottom', 'bottom-right']
})

const emit = defineEmits<ResizeBoxEmits>()

const boxRef = ref<HTMLElement | null>(null)
const boxWidth = ref<number | string>(props.width)
const boxHeight = ref<number | string>(props.height)
const activeHandle = ref<ResizeDirection | null>(null)

function toCss(val: number | string): string {
  return typeof val === 'number' ? `${val}px` : val
}

const boxStyle = computed(() => ({
  width: toCss(boxWidth.value),
  height: toCss(boxHeight.value)
}))

function clamp(val: number, min?: number, max?: number): number {
  let v = val
  if (min != null) v = Math.max(min, v)
  if (max != null) v = Math.min(max, v)
  return v
}

let startX = 0
let startY = 0
let startW = 0
let startH = 0
let startLeft = 0
let startTop = 0

function onPointerMove(e: PointerEvent) {
  if (!activeHandle.value || !boxRef.value) return
  const dir = activeHandle.value
  const dx = e.clientX - startX
  const dy = e.clientY - startY

  let w = startW
  let h = startH

  if (dir.includes('right')) w = startW + dx
  if (dir.includes('left')) w = startW - dx
  if (dir.includes('bottom')) h = startH + dy
  if (dir.includes('top')) h = startH - dy

  w = clamp(w, props.minWidth, props.maxWidth)
  h = clamp(h, props.minHeight, props.maxHeight)

  boxWidth.value = w
  boxHeight.value = h
  emit('resize', { width: w, height: h })

  void startLeft
  void startTop
}

function onPointerUp() {
  activeHandle.value = null
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

function onHandleDown(dir: ResizeDirection, e: PointerEvent) {
  if (!boxRef.value) return
  e.preventDefault()
  activeHandle.value = dir
  startX = e.clientX
  startY = e.clientY
  const rect = boxRef.value.getBoundingClientRect()
  startW = rect.width
  startH = rect.height
  startLeft = rect.left
  startTop = rect.top

  const cursors: Record<string, string> = {
    right: 'ew-resize',
    left: 'ew-resize',
    top: 'ns-resize',
    bottom: 'ns-resize',
    'top-right': 'nesw-resize',
    'bottom-right': 'nwse-resize',
    'bottom-left': 'nesw-resize',
    'top-left': 'nwse-resize'
  }
  document.body.style.cursor = cursors[dir] ?? 'default'
  document.body.style.userSelect = 'none'
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
}

onUnmounted(() => {
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})

const handles = computed(() => props.directions ?? [])
</script>

<template>
  <div ref="boxRef" :class="['vp-resize-box', props.class]" :style="{ ...boxStyle, ...style }">
    <div class="vp-resize-box__content">
      <slot />
    </div>
    <div
      v-for="dir in handles"
      :key="dir"
      :class="[
        'vp-resize-box__handle',
        `vp-resize-box__handle--${dir}`,
        { 'vp-resize-box__handle--active': activeHandle === dir }
      ]"
      @pointerdown="onHandleDown(dir, $event)"
    />
  </div>
</template>
