<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, useAttrs } from 'vue'
import type { IconProps } from './types'
import { resolveLucideIcon } from '@amg-webui/icons'
import { useMotion } from '@amg-webui/hooks'
import { IconStyleService, type IconStyleName } from '@amg-webui/theme'
import { useIcon } from './useIcon'
import './style.scss'

/**
 * Lucide ships plain SVG paths — no animation package / extra deps.
 * Host keyframe motion is the shared library feature (`useMotion` + `vp-motion--*`).
 * rotate / flip → `style.transform` on the <svg> (Lucide preserves `style`).
 * Interactive mode: `interactive` or parent `@click` → role=button + keyboard.
 * Presentational Telemetry skip — click is business emit only (see TELEMETRY.md).
 * @see https://lucide.dev
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<IconProps>(), {
  telemetry: undefined,
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
  flipV: false,
  interactive: false
})

/** Inline — imported `IconEmits` is not expanded into runtime emits. */
const emit = defineEmits<{
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}>()
const attrs = useAttrs()
const instance = getCurrentInstance()

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

const hasClickListener = computed(
  () => typeof instance?.vnode.props?.onClick === 'function'
)

const {
  sizeClassList,
  lucideSize,
  customSizeStyle,
  strokeWidth,
  a11yLabel,
  transformValue,
  resolvedName,
  isInteractive,
  isActionLocked,
  a11yAttrs
} = useIcon(
  computed(() => ({
    size: props.size,
    name: props.name,
    loading: props.loading,
    disabled: props.disabled,
    interactive: props.interactive,
    label: props.label,
    alt: props.alt,
    title: props.title,
    rotate: props.rotate,
    flip: props.flip,
    flipH: props.flipH,
    flipV: props.flipV,
    strokeWidth: props.strokeWidth,
    iconStyle: iconStyle.value,
    hasClickListener: hasClickListener.value
  }))
)

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
  isInteractive.value && 'vp-icon--interactive p-icon-interactive',
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

function onClick(event: MouseEvent) {
  if (isActionLocked.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  if (!isInteractive.value) return
  emit('click', event)
}

function onKeydown(event: KeyboardEvent) {
  emit('keydown', event)
  if (!isInteractive.value || isActionLocked.value) return
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  emit('click', event as unknown as MouseEvent)
}

function onFocus(event: FocusEvent) {
  if (!isInteractive.value) return
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  if (!isInteractive.value) return
  emit('blur', event)
}
</script>

<template>
  <span
    v-bind="attrs"
    :class="rootClass"
    :style="rootStyle"
    data-icon-set="lucide"
    :role="a11yAttrs.role"
    :tabindex="a11yAttrs.tabindex"
    :aria-label="a11yAttrs['aria-label']"
    :aria-hidden="a11yAttrs['aria-hidden']"
    :aria-disabled="a11yAttrs['aria-disabled']"
    :aria-busy="a11yAttrs['aria-busy']"
    :title="title || a11yLabel"
    @click="onClick"
    @keydown="onKeydown"
    @focus="onFocus"
    @blur="onBlur"
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
