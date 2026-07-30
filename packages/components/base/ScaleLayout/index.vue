<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ScaleLayoutFit, ScaleLayoutOrigin } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    scale?: number
    width?: number
    height?: number
    fit?: ScaleLayoutFit
    origin?: ScaleLayoutOrigin
    fill?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    scale: 1,
    fit: 'manual',
    origin: 'center',
    fill: true
  }
)

const hostRef = ref<HTMLElement | null>(null)
const hostSize = ref({ width: 0, height: 0 })
let resizeObserver: ResizeObserver | null = null

const clampScale = (n: number) => {
  if (!Number.isFinite(n) || n <= 0) return 1
  return Math.min(4, Math.max(0.1, n))
}

const measure = () => {
  const el = hostRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  hostSize.value = {
    width: Math.max(0, rect.width),
    height: Math.max(0, rect.height)
  }
}

const bindObserver = () => {
  resizeObserver?.disconnect()
  resizeObserver = null
  const el = hostRef.value
  if (!el || typeof ResizeObserver === 'undefined') {
    measure()
    return
  }
  resizeObserver = new ResizeObserver(() => measure())
  resizeObserver.observe(el)
  measure()
}

onMounted(async () => {
  await nextTick()
  bindObserver()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

watch(
  () => [props.fit, props.width, props.height, props.fill] as const,
  async () => {
    await nextTick()
    bindObserver()
  }
)

const designW = computed(() => {
  const w = Number(props.width)
  return Number.isFinite(w) && w > 0 ? w : null
})

const designH = computed(() => {
  const h = Number(props.height)
  return Number.isFinite(h) && h > 0 ? h : null
})

const resolvedScale = computed(() => {
  if (props.fit === 'manual' || designW.value == null || designH.value == null) {
    return clampScale(Number(props.scale))
  }
  const { width: cw, height: ch } = hostSize.value
  if (cw <= 0 || ch <= 0) return 1
  const sx = cw / designW.value
  const sy = ch / designH.value
  if (props.fit === 'contain') return clampScale(Math.min(sx, sy))
  if (props.fit === 'cover') return clampScale(Math.max(sx, sy))
  if (props.fit === 'width') return clampScale(sx)
  if (props.fit === 'height') return clampScale(sy)
  return clampScale(Number(props.scale))
})

const hasDesign = computed(() => designW.value != null && designH.value != null)

const rootClass = computed(() => [
  'vp-scale-layout',
  `vp-scale-layout--${props.origin}`,
  `vp-scale-layout--fit-${props.fit}`,
  {
    'vp-scale-layout--fill': props.fill,
    'vp-scale-layout--design': hasDesign.value
  },
  props.class
])

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  '--vp-scale': String(resolvedScale.value)
}))

const innerStyle = computed(() => {
  if (!hasDesign.value) {
    // Manual / content-driven: expand logical size so after scale it covers the host
    return {
      width: `calc(100% / var(--vp-scale, 1))`,
      height: props.fill ? `calc(100% / var(--vp-scale, 1))` : undefined,
      minHeight: props.fill ? `calc(100% / var(--vp-scale, 1))` : undefined
    }
  }
  return {
    width: `${designW.value}px`,
    height: `${designH.value}px`
  }
})

defineExpose({
  scale: resolvedScale,
  hostSize
})
</script>

<template>
  <div ref="hostRef" :class="rootClass" :style="rootStyle" data-component="ScaleLayout">
    <div class="vp-scale-layout__inner" :style="innerStyle">
      <slot></slot>
    </div>
  </div>
</template>
