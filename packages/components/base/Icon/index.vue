<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { IconProps } from './types'
import { resolveLucideIcon } from '@amg-webui/icons'
import { useMotion } from '@amg-webui/hooks'
import { IconStyleService, type IconStyleName } from '@amg-webui/theme'
import './style.scss'

/**
 * Lucide ships plain SVG paths — no animation package / extra deps.
 * Host keyframe motion is the shared library feature (`useMotion` + `vp-motion--*`).
 * rotate / flip → `style.transform` on the <svg> (Lucide preserves `style`).
 * @see https://lucide.dev
 */
const props = withDefaults(defineProps<IconProps>(), {
  size: 'md',
  absoluteStrokeWidth: false,
  spin: false,
  pulse: false,
  heartbeat: false,
  bounce: false,
  blink: false,
  breathe: false,
  glow: false,
  marqueeLeft: false,
  marqueeRight: false,
  scrollUp: false,
  scrollDown: false,
  dampOut: false,
  disabled: false,
  loading: false,
  selected: false,
  flipH: false,
  flipV: false
})

const iconStyle = ref<IconStyleName>(IconStyleService.getCurrentStyle())
let unsub: (() => void) | undefined

onMounted(() => {
  iconStyle.value = IconStyleService.getCurrentStyle()
  unsub = IconStyleService.subscribe((s) => {
    iconStyle.value = s
  })
})

onUnmounted(() => {
  unsub?.()
})

const TOKEN_SIZES = new Set(['xs', 'sm', 'md', 'lg', 'xl'])

const sizeClassList = computed(() => {
  if (typeof props.size === 'string' && TOKEN_SIZES.has(props.size)) {
    return [`vp-icon--${props.size}`, `p-icon-${props.size}`]
  }
  return []
})

const lucideSize = computed(() => {
  if (typeof props.size === 'number') return props.size
  if (typeof props.size === 'string' && /^\d+(\.\d+)?$/.test(props.size)) return Number(props.size)
  return undefined
})

const customSizeStyle = computed(() => {
  const out: Record<string, string> = {}
  if (typeof props.size === 'number') {
    out.width = `${props.size}px`
    out.height = `${props.size}px`
    return out
  }
  if (typeof props.size === 'string' && /^\d+(\.\d+)?$/.test(props.size)) {
    out.width = `${props.size}px`
    out.height = `${props.size}px`
    return out
  }
  if (typeof props.size === 'string' && !TOKEN_SIZES.has(props.size)) {
    out.width = props.size
    out.height = props.size
  }
  return out
})

const strokeWidth = computed(() => {
  if (props.strokeWidth != null) return props.strokeWidth
  return iconStyle.value === 'solid' ? 2.25 : 1.75
})

const a11yLabel = computed(() => props.label || props.alt || undefined)

const resolvedFlipH = computed(
  () => props.flipH || props.flip === 'horizontal' || props.flip === 'both'
)
const resolvedFlipV = computed(
  () => props.flipV || props.flip === 'vertical' || props.flip === 'both'
)

const transformValue = computed(() => {
  const parts: string[] = []
  const deg = Number(props.rotate)
  if (Number.isFinite(deg) && deg !== 0) parts.push(`rotate(${deg}deg)`)
  if (resolvedFlipH.value) parts.push('scaleX(-1)')
  if (resolvedFlipV.value) parts.push('scaleY(-1)')
  return parts.length ? parts.join(' ') : undefined
})

const { motionClass, motionStyle } = useMotion(() => ({
  spin: props.spin,
  pulse: props.pulse,
  heartbeat: props.heartbeat,
  bounce: props.bounce,
  blink: props.blink,
  breathe: props.breathe,
  glow: props.glow,
  marqueeLeft: props.marqueeLeft,
  marqueeRight: props.marqueeRight,
  scrollUp: props.scrollUp,
  scrollDown: props.scrollDown,
  dampOut: props.dampOut,
  forceSpin: props.loading,
  animationDuration: props.animationDuration,
  legacyIconClasses: true
}))

const resolvedName = computed(() => {
  if (props.loading) return 'Loader2'
  return props.name
})

const LucideComponent = computed(() =>
  resolvedName.value ? resolveLucideIcon(resolvedName.value) : undefined
)

const rootClass = computed(() => [
  'vp-icon',
  'p-icon',
  'vp-icon--lucide',
  'p-icon--lucide',
  ...sizeClassList.value,
  ...motionClass.value,
  props.disabled && 'vp-icon--disabled p-icon-disabled',
  props.selected && 'vp-icon--selected p-icon-selected',
  props.class
])

const rootStyle = computed(() => {
  const style: Record<string, string> = {
    ...(props.style || {}),
    ...customSizeStyle.value,
    ...motionStyle.value
  }
  if (props.color) style.color = props.color
  if (props.opacity != null) style.opacity = String(props.opacity)
  style['--icon-stroke-width'] = String(strokeWidth.value)
  return style
})

/**
 * Passed to Lucide <svg> — Lucide keeps `style`, but overwrites `class`.
 * @see node_modules/@lucide/vue/dist/esm/Icon.mjs
 */
const lucideSvgStyle = computed(() => {
  if (!transformValue.value) return undefined
  return {
    transform: transformValue.value,
    transformOrigin: 'center center',
    transformBox: 'fill-box'
  } as Record<string, string>
})
</script>

<template>
  <span
    :class="rootClass"
    :style="rootStyle"
    data-icon-set="lucide"
    :role="a11yLabel ? 'img' : undefined"
    :aria-label="a11yLabel"
    :aria-hidden="a11yLabel ? undefined : true"
    :title="title || a11yLabel"
  >
    <component
      v-if="LucideComponent"
      :is="LucideComponent"
      :style="lucideSvgStyle"
      :size="lucideSize"
      :color="color || 'currentColor'"
      :stroke-width="strokeWidth"
      :absolute-stroke-width="absoluteStrokeWidth"
      aria-hidden="true"
    />
    <slot v-else />
  </span>
</template>
