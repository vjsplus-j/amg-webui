<script setup lang="ts">
import { computed, getCurrentInstance, inject, ref, useSlots, watch } from 'vue'
import type { AvatarProps, AvatarEmits } from './types'
import { AVATAR_CONFIG_KEY, AVATAR_GROUP_KEY } from './config'
import { useMotion } from '@amg-webui/hooks'
import Icon from '../Icon/index.vue'
import Tooltip from '../Tooltip/index.vue'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

defineOptions({ inheritAttrs: false })

/** Inline intersection — SFC compiler does not expand imported extends / some remote fields. */
type AvatarPropsWithMotion = AvatarProps & {
  /** Appearance: default | neon lightboard */
  variant?: 'default' | 'neon'
  spin?: boolean
  pulse?: boolean
  heartbeat?: boolean
  bounce?: boolean
  blink?: boolean
  breathe?: boolean
  glow?: boolean
  marqueeLeft?: boolean
  marqueeRight?: boolean
  scrollUp?: boolean
  scrollDown?: boolean
  dampOut?: boolean
  animationDuration?: number | string
}

const props = withDefaults(defineProps<AvatarPropsWithMotion>(), {
  telemetry: undefined,
  size: undefined,
  shape: undefined,
  textMaxLength: 2,
  bordered: undefined,
  variant: undefined,
  disabled: false,
  loading: false,
  clickable: false,
  tooltipDelay: undefined,
  fallbackIcon: undefined,
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
  dampOut: false
})

const emit = defineEmits<AvatarEmits>()
const slots = useSlots()
const instance = getCurrentInstance()
const globalConfig = inject(AVATAR_CONFIG_KEY, {})
const groupCtx = inject(AVATAR_GROUP_KEY, null)

const primaryFailed = ref(false)
const fallbackImgFailed = ref(false)
const imgLoading = ref(false)

watch(
  () => props.src,
  (src) => {
    primaryFailed.value = false
    fallbackImgFailed.value = false
    imgLoading.value = Boolean(src)
  },
  { immediate: true }
)

watch(
  () => props.fallbackSrc,
  () => {
    fallbackImgFailed.value = false
  }
)

const resolvedSize = computed(
  () => props.size ?? groupCtx?.size.value ?? globalConfig.size ?? 'md'
)
const resolvedShape = computed(
  () => props.shape ?? groupCtx?.shape.value ?? globalConfig.shape ?? 'circle'
)
const resolvedDisabled = computed(
  () => Boolean(props.disabled || groupCtx?.disabled.value)
)
const resolvedBordered = computed(() => props.bordered ?? globalConfig.bordered ?? true)
const resolvedVariant = computed(
  () => props.variant ?? groupCtx?.variant.value ?? 'default'
)
const isNeon = computed(() => resolvedVariant.value === 'neon')
const resolvedBorderRadius = computed(
  () => props.borderRadius ?? globalConfig.borderRadius
)
const resolvedTooltipDelay = computed(
  () => props.tooltipDelay ?? globalConfig.tooltipDelay ?? 200
)
const resolvedFallbackIcon = computed(
  () => props.icon ?? props.fallbackIcon ?? globalConfig.fallbackIcon ?? 'User'
)

const sizeClass = computed(() => {
  const size = resolvedSize.value
  if (typeof size === 'string' && ['xs', 'sm', 'md', 'lg', 'xl'].includes(size)) {
    return `vp-avatar--${size}`
  }
  return 'vp-avatar--custom'
})

const iconSize = computed(() => {
  const size = resolvedSize.value
  if (typeof size === 'string' && ['xs', 'sm', 'md', 'lg', 'xl'].includes(size)) {
    return size
  }
  return 'md'
})

const activeSrc = computed(() => {
  if (props.src && !primaryFailed.value) return props.src
  if (props.fallbackSrc && !fallbackImgFailed.value) return props.fallbackSrc
  return undefined
})

const showImage = computed(() => Boolean(activeSrc.value))

const letterText = computed(() => {
  const raw = props.text || props.fallbackText || ''
  if (!raw) return ''
  const chars = Array.from(raw)
  const sliced = chars.slice(0, props.textMaxLength).join('')
  if (/^[A-Za-z0-9+\s.-]+$/.test(sliced)) return sliced.toUpperCase()
  return sliced
})

const showLetter = computed(() => Boolean(letterText.value) && !showImage.value)
const showIcon = computed(() => {
  if (showImage.value || showLetter.value) return false
  if (slots.icon || props.icon || props.fallbackIcon) return true
  // Default User placeholder when no custom default slot
  return !slots.default
})

const showSkeleton = computed(
  () => props.loading || (showImage.value && imgLoading.value)
)

const isInteractive = computed(() => {
  if (props.clickable) return true
  return typeof instance?.vnode.props?.onClick === 'function'
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
  animationDuration: props.animationDuration
}))

const avatarClass = computed(() => [
  'vp-avatar',
  sizeClass.value,
  `vp-avatar--${resolvedShape.value}`,
  {
    'vp-avatar--bordered': resolvedBordered.value || isNeon.value,
    'vp-avatar--neon': isNeon.value,
    'vp-avatar--disabled': resolvedDisabled.value,
    'vp-avatar--loading': showSkeleton.value,
    'vp-avatar--clickable': isInteractive.value && !resolvedDisabled.value
  },
  ...motionClass.value,
  props.class
])

const avatarStyle = computed(() => {
  const style: Record<string, string> = {
    ...(props.style || {}),
    ...motionStyle.value
  }
  const size = resolvedSize.value
  if (typeof size === 'number') {
    style.width = `${size}px`
    style.height = `${size}px`
    style.fontSize = `calc(${size}px * 0.36)`
  }
  if (resolvedBorderRadius.value) {
    style.borderRadius = resolvedBorderRadius.value
  }
  const neonColor = props.borderColor ?? globalConfig.borderColor
  if (isNeon.value && neonColor) {
    style['--vp-neon'] = neonColor
  }
  if (props.borderColor ?? globalConfig.borderColor) {
    style['--vp-avatar-border-color'] = props.borderColor ?? globalConfig.borderColor ?? ''
  }
  if (props.borderWidth) {
    style['--vp-avatar-border-width'] = props.borderWidth
  }
  if (props.colorBg ?? globalConfig.colorBg) {
    style['--vp-avatar-bg'] = props.colorBg ?? globalConfig.colorBg ?? ''
  }
  if (props.colorText ?? globalConfig.colorText) {
    style['--vp-avatar-fg'] = props.colorText ?? globalConfig.colorText ?? ''
  }
  return style
})

const rootRole = computed(() => (isInteractive.value ? 'button' : 'img'))
const rootTabindex = computed(() => {
  if (resolvedDisabled.value) return undefined
  if (isInteractive.value) return 0
  return undefined
})

const ariaLabel = computed(() => props.alt || props.text || props.tooltip || undefined)
const tooltipDisabled = computed(() => resolvedDisabled.value || !props.tooltip)

function handleError(event: Event) {
  if (props.src && !primaryFailed.value && activeSrc.value === props.src) {
    primaryFailed.value = true
    imgLoading.value = Boolean(props.fallbackSrc)
    trackEmit({
      component: 'Avatar',
      type: 'error',
      category: 'error',
      trackId: props.trackId,
      telemetry: props.telemetry,
      severity: 'error'
    })
    emit('error', event)
    return
  }
  fallbackImgFailed.value = true
  imgLoading.value = false
  trackEmit({
    component: 'Avatar',
    type: 'error',
    category: 'error',
    trackId: props.trackId,
    telemetry: props.telemetry,
    severity: 'error'
  })
  emit('error', event)
}

function handleLoad(event: Event) {
  imgLoading.value = false
  trackEmit({
    component: 'Avatar',
    type: 'load',
    category: 'lifecycle',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
  emit('load', event)
}

function handleClick(event: MouseEvent) {
  if (resolvedDisabled.value) return
  trackEmit({
    component: 'Avatar',
    type: 'click',
    trackId: props.trackId,
    telemetry: props.telemetry,
    name: ariaLabel.value
  })
  emit('click', event)
}

function handleKeydown(event: KeyboardEvent) {
  if (!isInteractive.value || resolvedDisabled.value) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    trackEmit({
      component: 'Avatar',
      type: 'click',
      trackId: props.trackId,
      telemetry: props.telemetry,
      name: ariaLabel.value
    })
    emit('click', event as unknown as MouseEvent)
  }
}
</script>

<template>
  <Tooltip
    :content="tooltip"
    :disabled="tooltipDisabled"
    :delay="resolvedTooltipDelay"
  >
    <span
      :class="avatarClass"
      :style="avatarStyle"
      :role="rootRole"
      :aria-label="ariaLabel"
      :aria-disabled="resolvedDisabled || undefined"
      :aria-busy="showSkeleton || undefined"
      :tabindex="rootTabindex"
      @click="handleClick"
      @keydown="handleKeydown"
    >
      <span v-if="showSkeleton" class="vp-avatar__skeleton" aria-hidden="true" />
      <img
        v-if="showImage"
        :src="activeSrc"
        :alt="alt ?? ''"
        class="vp-avatar__img"
        :class="{ 'vp-avatar__img--hidden': showSkeleton }"
        @error="handleError"
        @load="handleLoad"
      />
      <span v-else-if="!showSkeleton && showLetter" class="vp-avatar__text">{{ letterText }}</span>
      <span v-else-if="!showSkeleton && showIcon" class="vp-avatar__icon" aria-hidden="true">
        <slot name="icon">
          <Icon :name="resolvedFallbackIcon" :size="iconSize" />
        </slot>
      </span>
      <slot v-else-if="!showSkeleton" />
    </span>
  </Tooltip>
</template>
