<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import './style.scss'

const props = withDefaults(
  defineProps<{
    /** `absolute` for framed demos / local hosts; `fixed` for viewport chrome */
    mode?: 'fixed' | 'absolute'
    position?: 'top' | 'bottom' | 'left' | 'right'
    offset?: 'none' | 'sm' | 'md' | 'lg'
    zIndex?: number
    /** Reserve in-flow space so the bar does not cover sibling content (default true) */
    placeholder?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    mode: 'fixed',
    position: 'top',
    offset: 'none',
    zIndex: 10,
    placeholder: true
  }
)

const offsetMap: Record<string, string> = {
  none: '0',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)'
}

const barRef = ref<HTMLElement | null>(null)
const barSize = ref({ width: 0, height: 0 })
let resizeObserver: ResizeObserver | null = null

const measure = () => {
  const el = barRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  barSize.value = {
    width: Math.ceil(rect.width),
    height: Math.ceil(rect.height)
  }
}

const bindObserver = () => {
  resizeObserver?.disconnect()
  resizeObserver = null
  const el = barRef.value
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
  () => [props.position, props.offset, props.mode, props.placeholder] as const,
  async () => {
    await nextTick()
    bindObserver()
  }
)

const rootClass = computed(() => [
  'vp-fixed-layout',
  `vp-fixed-layout--${props.mode}`,
  `vp-fixed-layout--${props.position}`,
  props.class
])

const rootStyle = computed(() => {
  const o = offsetMap[props.offset] ?? '0'
  const pos: Record<string, string> = {
    zIndex: String(props.zIndex),
    position: props.mode === 'absolute' ? 'absolute' : 'fixed'
  }
  if (props.position === 'top') {
    pos.top = o
    pos.left = '0'
    pos.right = '0'
  } else if (props.position === 'bottom') {
    pos.bottom = o
    pos.left = '0'
    pos.right = '0'
  } else if (props.position === 'left') {
    pos.left = o
    pos.top = '0'
    pos.bottom = '0'
  } else {
    pos.right = o
    pos.top = '0'
    pos.bottom = '0'
  }
  return { ...(props.style ?? {}), ...pos }
})

const placeholderClass = computed(() => [
  'vp-fixed-layout__placeholder',
  `vp-fixed-layout__placeholder--${props.position}`
])

const placeholderStyle = computed(() => {
  const { width, height } = barSize.value
  const gap = offsetMap[props.offset] ?? '0'
  const withOffset = (px: number) =>
    props.offset === 'none' ? `${px}px` : `calc(${gap} + ${px}px)`

  if (props.position === 'top' || props.position === 'bottom') {
    return height ? { height: withOffset(height), width: '100%' } : { width: '100%' }
  }
  return width ? { width: withOffset(width) } : {}
})

const placeholderBefore = computed(
  () => props.placeholder && (props.position === 'top' || props.position === 'left')
)
const placeholderAfter = computed(
  () => props.placeholder && (props.position === 'bottom' || props.position === 'right')
)
</script>

<template>
  <div
    v-if="placeholderBefore"
    :class="placeholderClass"
    :style="placeholderStyle"
    aria-hidden="true"
  />
  <div ref="barRef" :class="rootClass" :style="rootStyle" data-component="FixedLayout">
    <slot></slot>
  </div>
  <div
    v-if="placeholderAfter"
    :class="placeholderClass"
    :style="placeholderStyle"
    aria-hidden="true"
  />
</template>
