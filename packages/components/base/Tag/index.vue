<script setup lang="ts">
import { computed, getCurrentInstance, inject, useAttrs, useSlots } from 'vue'
import type { TagProps, TagEmits } from './types'
import { TAG_CONFIG_KEY } from './config'
import { useLocale, useMotion } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Icon from '../Icon/index.vue'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

defineOptions({ inheritAttrs: false })

/** Inline intersection — SFC compiler does not expand imported extends MotionProps. */
type TagPropsWithMotion = TagProps & {
  /** solid | outlined | light | neon */
  effect?: 'solid' | 'outlined' | 'light' | 'neon'
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

const props = withDefaults(defineProps<TagPropsWithMotion>(), {
  telemetry: undefined,
  severity: undefined,
  type: undefined,
  effect: undefined,
  size: undefined,
  closable: false,
  round: false,
  rounded: false,
  disabled: false,
  clickable: false,
  wait: undefined,
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

const emit = defineEmits<TagEmits>()
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
const { t } = useLocale()
const globalConfig = inject(TAG_CONFIG_KEY, {})

/** Leading-edge lock ??first close fires; repeats ignored until wait elapses */
let closeLockedUntil = 0

const resolvedSeverity = computed(() => {
  const raw = props.type ?? props.severity ?? globalConfig.severity ?? 'default'
  return raw === 'default' ? 'secondary' : raw
})

const resolvedEffect = computed(() => props.effect ?? globalConfig.effect ?? 'light')
const resolvedSize = computed(() => props.size ?? globalConfig.size ?? 'md')
const resolvedWait = computed(() => props.wait ?? globalConfig.wait ?? 300)
const resolvedBorderRadius = computed(
  () => props.borderRadius ?? globalConfig.borderRadius
)
const isRound = computed(() => props.round || props.rounded)
const iconTokenSize = computed(() => props.iconSize ?? resolvedSize.value)

const hasCustomColor = computed(
  () => Boolean(props.color || props.colorBg || props.colorText || props.colorBorder)
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

const tagClass = computed(() => [
  'vp-tag',
  `vp-tag--${resolvedSeverity.value}`,
  `vp-tag--${resolvedEffect.value}`,
  `vp-tag--${resolvedSize.value}`,
  {
    'vp-tag--round': isRound.value,
    'vp-tag--disabled': props.disabled,
    'vp-tag--closable': props.closable,
    'vp-tag--clickable': isInteractive.value && !props.disabled,
    'vp-tag--custom': hasCustomColor.value
  },
  ...motionClass.value,
  props.class
])

const tagStyle = computed(() => {
  const style: Record<string, string> = {
    ...(props.style || {}),
    ...motionStyle.value
  }
  if (resolvedBorderRadius.value) {
    style.borderRadius = resolvedBorderRadius.value
  }
  const effect = resolvedEffect.value
  if (props.colorBg) style['--vp-tag-custom-bg'] = props.colorBg
  if (props.colorText) style['--vp-tag-custom-fg'] = props.colorText
  if (props.colorBorder) style['--vp-tag-custom-border'] = props.colorBorder
  if (props.color) {
    if (effect === 'solid') {
      if (!props.colorBg) style['--vp-tag-custom-bg'] = props.color
      if (!props.colorBorder) style['--vp-tag-custom-border'] = props.color
      if (!props.colorText) style['--vp-tag-custom-fg'] = 'var(--text-on-primary, var(--surface-0))'
    } else if (effect === 'neon') {
      if (!props.colorText) style['--vp-tag-custom-fg'] = props.color
      if (!props.colorBorder) style['--vp-tag-custom-border'] = props.color
      style['--vp-neon'] = props.color
    } else {
      if (!props.colorText) style['--vp-tag-custom-fg'] = props.color
      if (!props.colorBorder) style['--vp-tag-custom-border'] = props.color
      if (effect === 'light' && !props.colorBg) {
        style['--vp-tag-custom-bg'] = 'var(--ds-accent-muted, var(--surface-2))'
      }
    }
  }
  return style
})

const closeLabel = computed(() => t(LocaleKeys.common.close))
const showIcon = computed(() => Boolean(slots.icon || props.icon))

const rootRole = computed(() => (isInteractive.value ? 'button' : 'status'))

const rootTabindex = computed(() => {
  if (props.disabled) return undefined
  if (isInteractive.value) return 0
  return undefined
})

async function runBeforeClose(event: MouseEvent): Promise<boolean> {
  if (!props.beforeClose) return true
  try {
    const result = await props.beforeClose(event)
    return result !== false
  } catch {
    return false
  }
}

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  trackEmit({
    component: 'Tag',
    type: 'click',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
  emit('click', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isInteractive.value || props.disabled) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    trackEmit({
      component: 'Tag',
      type: 'click',
      trackId: props.trackId,
      telemetry: props.telemetry
    })
    emit('click', event as unknown as MouseEvent)
  }
}

const handleClose = async (event: MouseEvent) => {
  event.stopPropagation()
  if (props.disabled) return
  const now = Date.now()
  if (now < closeLockedUntil) return
  if (!(await runBeforeClose(event))) return
  closeLockedUntil = now + resolvedWait.value
  trackEmit({
    component: 'Tag',
    type: 'close',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
  emit('close', event)
}
</script>

<template>
  <span
    v-bind="attrs"
    :class="tagClass"
    :style="tagStyle"
    :role="rootRole"
    :tabindex="rootTabindex"
    :aria-disabled="disabled || undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span v-if="showIcon" class="vp-tag__icon" aria-hidden="true">
      <slot name="icon">
        <Icon v-if="icon" :name="icon" :size="iconTokenSize" />
      </slot>
    </span>
    <span class="vp-tag__label">
      <slot>{{ label }}</slot>
    </span>
    <button
      v-if="closable"
      type="button"
      class="vp-tag__close"
      :aria-label="closeLabel"
      :disabled="disabled"
      tabindex="0"
      @click="handleClose"
      @keydown.enter.stop.prevent="handleClose($event as unknown as MouseEvent)"
    >
      <slot name="closeIcon">
        <Icon name="X" :size="iconTokenSize" />
      </slot>
    </button>
  </span>
</template>
