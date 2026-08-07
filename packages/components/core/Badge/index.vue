<script setup lang="ts">
import { computed, inject } from 'vue'
import type { BadgeProps, BadgeEmits } from './types'
import { BADGE_CONFIG_KEY } from './config'
import { useLocale, useMotion } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Tooltip from '../Tooltip/index.vue'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

/** Inline intersection — SFC compiler does not expand imported extends MotionProps. */
type BadgePropsWithMotion = BadgeProps & {
  spin?: boolean
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

const props = withDefaults(defineProps<BadgePropsWithMotion>(), {
  telemetry: undefined,
  max: undefined,
  dot: false,
  hidden: false,
  severity: undefined,
  type: undefined,
  size: undefined,
  position: undefined,
  offset: undefined,
  tooltipDelay: undefined,
  disabled: false,
  pulse: undefined,
  decorative: false,
  spin: false,
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

const emit = defineEmits<BadgeEmits>()

const { t } = useLocale()
const globalConfig = inject(BADGE_CONFIG_KEY, {})

function handleClick(event: MouseEvent) {
  if (props.disabled) return
  trackEmit({
    component: 'Badge',
    type: 'click',
    trackId: props.trackId,
    telemetry: props.telemetry,
    name: props.ariaLabel || props.tooltip
  })
  emit('click', event)
}

const resolvedMax = computed(() => props.max ?? globalConfig.max ?? 99)
const resolvedSize = computed(() => props.size ?? globalConfig.size ?? 'sm')
const resolvedSeverity = computed(
  () => props.type ?? props.severity ?? globalConfig.severity ?? 'danger'
)
const resolvedPosition = computed(
  () => props.position ?? globalConfig.position ?? 'top-right'
)
const resolvedOffset = computed(
  () => props.offset ?? globalConfig.offset ?? ([0, 0] as [number, number])
)
const resolvedTooltipDelay = computed(
  () => props.tooltipDelay ?? globalConfig.tooltipDelay ?? 200
)
const resolvedPulse = computed(() => props.pulse ?? globalConfig.pulse ?? false)
const resolvedColorBg = computed(
  () => props.colorBg ?? props.color ?? globalConfig.colorBg
)
const resolvedColorText = computed(() => props.colorText ?? globalConfig.colorText)

/** Shared motion on the mark ??Badge `pulse` stays ring/brightness, not opacity blink. */
const { motionClass, motionStyle } = useMotion(() => ({
  spin: props.spin,
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

const numericValue = computed(() => {
  if (props.value == null || props.value === '') return null
  const num = Number(props.value)
  return Number.isNaN(num) ? null : num
})

const isTextMark = computed(
  () => props.value != null && props.value !== '' && numericValue.value === null
)

const displayValue = computed(() => {
  if (props.dot || props.value == null || props.value === '') return ''
  const num = numericValue.value
  if (num != null && num > resolvedMax.value) return `${resolvedMax.value}+`
  return String(props.value)
})

const showBadge = computed(() => {
  if (props.hidden) return false
  if (props.dot) return true
  if (props.value == null || props.value === '') return false
  const num = numericValue.value
  if (num != null && num <= 0) return false
  return true
})

const needsScale = computed(() => {
  if (props.dot || isTextMark.value) return false
  const text = displayValue.value
  return text.length >= 3
})

const badgeStyle = computed(() => {
  const [x, y] = resolvedOffset.value
  const style: Record<string, string> = {
    ...(props.style ?? {}),
    '--vp-badge-offset-x': String(x),
    '--vp-badge-offset-y': String(y)
  }
  if (resolvedColorBg.value) style['--vp-badge-bg'] = resolvedColorBg.value
  if (resolvedColorText.value) style['--vp-badge-fg'] = resolvedColorText.value
  return style
})

const badgeClass = computed(() => [
  'vp-badge',
  `vp-badge--${resolvedSeverity.value}`,
  `vp-badge--${resolvedSize.value}`,
  `vp-badge--${resolvedPosition.value}`,
  {
    'vp-badge--dot': props.dot,
    'vp-badge--hidden': !showBadge.value,
    'vp-badge--disabled': props.disabled,
    'vp-badge--pulse': resolvedPulse.value && !props.disabled,
    'vp-badge--scale': needsScale.value
  }
])

const markMotionClass = computed(() => ['vp-badge__motion', ...motionClass.value])


const accessibleName = computed(() => {
  if (props.decorative) return undefined
  if (props.ariaLabel) return props.ariaLabel
  if (props.tooltip) return props.tooltip
  if (props.dot) return t(LocaleKeys.badge.ariaDot)
  if (displayValue.value) {
    return t(LocaleKeys.badge.ariaCount, { count: displayValue.value })
  }
  return undefined
})

const isDecorative = computed(
  () => props.decorative || !accessibleName.value || !showBadge.value
)

const tooltipDisabled = computed(() => !props.tooltip || props.disabled)
</script>

<template>
  <Tooltip
    :content="tooltip"
    :disabled="tooltipDisabled"
    :delay="resolvedTooltipDelay"
  >
    <span class="vp-badge-wrapper" :class="props.class" @click="handleClick">
      <slot />
      <sup
        v-if="showBadge"
        :class="badgeClass"
        :style="badgeStyle"
        :aria-hidden="isDecorative ? 'true' : undefined"
        :aria-label="isDecorative ? undefined : accessibleName"
        :role="isDecorative ? undefined : 'status'"
      >
        <span :class="markMotionClass" :style="motionStyle">
          <span v-if="!dot" class="vp-badge__content">{{ displayValue }}</span>
        </span>
      </sup>
    </span>
  </Tooltip>
</template>
