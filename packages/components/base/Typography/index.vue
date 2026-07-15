<script setup lang="ts">
import {
  computed,
  ref,
  useSlots,
  inject,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
  type CSSProperties
} from 'vue'
import type { TypographyProps, TypographyEmits } from './types'
import { TYPOGRAPHY_CONFIG_KEY } from './config'
import { MOTION_TRANSFORM_KINDS } from '@amg-webui/animations/motion'
import { useLocale, useMotion } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

/** Inline intersection — SFC compiler does not expand imported extends MotionProps. */
type TypographyPropsWithMotion = TypographyProps & {
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
  /** Inline — light-beam wait (also covered by loading) */
  shimmer?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<TypographyPropsWithMotion>(), {
  telemetry: undefined,
  type: undefined,
  copyable: false,
  ellipsis: false,
  strong: false,
  italic: false,
  underline: false,
  delete: false,
  mark: false,
  code: false,
  disabled: false,
  loading: false,
  shimmer: false,
  clickable: false,
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

const emit = defineEmits<TypographyEmits>()
const { t } = useLocale()
const slots = useSlots()
const globalConfig = inject(TYPOGRAPHY_CONFIG_KEY, {})

const contentRef = ref<HTMLElement | null>(null)
const copied = ref(false)
const copyStatus = ref('')
const isOverflowing = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
const BLOCK_TYPES = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'body',
  'body-lg',
  'body-sm'
])

const resolvedType = computed(() => props.type ?? globalConfig.type ?? 'body')

const resolvedColor = computed(
  () => props.color ?? props.typeColor ?? globalConfig.typeColor
)

const resolvedFont = computed(() => props.fontFamily ?? globalConfig.fontFamily)

const resolvedLineHeight = computed(() => props.lineHeight ?? globalConfig.lineHeight)

const ellipsisOpts = computed(() => {
  const raw = props.ellipsis
  if (raw === false || raw == null) {
    if (globalConfig.ellipsisRows) {
      return {
        rows: globalConfig.ellipsisRows,
        tooltip: globalConfig.ellipsisTooltip !== false
      }
    }
    return null
  }
  if (raw === true) {
    return {
      rows: globalConfig.ellipsisRows ?? 1,
      tooltip: globalConfig.ellipsisTooltip !== false
    }
  }
  return {
    rows: raw.rows ?? 1,
    tooltip: raw.tooltip ?? globalConfig.ellipsisTooltip !== false
  }
})

const copyOpts = computed(() => {
  const raw = props.copyable ?? globalConfig.copyable
  if (!raw) return null
  if (raw === true) return { text: undefined as string | undefined, icon: true }
  return {
    text: raw.text,
    icon: raw.icon !== false
  }
})

const tagName = computed(() => {
  const level = resolvedType.value
  if (HEADING_TAGS.has(level)) return level
  if (level === 'body' || level === 'body-lg' || level === 'body-sm') return 'p'
  if (props.code) return 'code'
  return 'span'
})

const isBlock = computed(() => BLOCK_TYPES.has(resolvedType.value))

const { motionKind, motionClass, motionStyle } = useMotion(() => ({
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

const transformMotion = computed(() => {
  const kind = motionKind.value
  return kind != null && MOTION_TRANSFORM_KINDS.has(kind)
})

const typographyClass = computed(() => [
  'vp-typography',
  `vp-typography--${resolvedType.value}`,
  {
    'vp-typography--block': isBlock.value,
    'vp-typography--strong': props.strong,
    'vp-typography--italic': props.italic,
    'vp-typography--underline': props.underline,
    'vp-typography--delete': props.delete,
    'vp-typography--mark': props.mark,
    'vp-typography--code': props.code,
    'vp-typography--ellipsis-single':
      Boolean(ellipsisOpts.value) && (ellipsisOpts.value?.rows ?? 1) <= 1,
    'vp-typography--ellipsis-multi':
      Boolean(ellipsisOpts.value) && (ellipsisOpts.value?.rows ?? 1) > 1,
    'vp-typography--copyable': Boolean(copyOpts.value),
    'vp-typography--disabled': props.disabled,
    'vp-typography--loading': props.loading,
    'vp-typography--shimmer': props.shimmer || props.loading,
    'vp-typography--clickable': props.clickable && !props.disabled && !props.loading,
    'vp-typography--transform-motion': transformMotion.value && !isBlock.value,
    [`vp-typography--${resolvedColor.value}`]: Boolean(resolvedColor.value),
    [`vp-typography--font-${resolvedFont.value}`]: Boolean(resolvedFont.value)
  },
  ...motionClass.value,
  props.class
])

const typographyStyle = computed(() => {
  const style: CSSProperties = {
    ...(props.style as CSSProperties),
    ...motionStyle.value
  }
  if (ellipsisOpts.value && (ellipsisOpts.value.rows ?? 1) > 1) {
    ;(style as Record<string, string>)['--vp-typography-rows'] = String(
      ellipsisOpts.value.rows
    )
  }
  if (resolvedLineHeight.value != null) {
    const lh = resolvedLineHeight.value
    ;(style as Record<string, string>)['--vp-typography-lh'] =
      typeof lh === 'number' ? String(lh) : lh
  }
  return style
})

const copyLabel = computed(() =>
  copied.value ? t(LocaleKeys.tip.copied) : t(LocaleKeys.common.copy)
)

const tooltipTitle = computed(() => {
  if (!ellipsisOpts.value?.tooltip || !isOverflowing.value) return undefined
  return getTextContent()
})

function extractNodeText(node: unknown): string {
  if (node == null) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractNodeText).join('')
  if (typeof node === 'object' && node !== null && 'children' in node) {
    return extractNodeText((node as { children: unknown }).children)
  }
  return ''
}

function getTextContent(): string {
  if (copyOpts.value?.text) return copyOpts.value.text
  if (props.content) return props.content
  const slotFn = slots.default
  if (!slotFn) return ''
  return slotFn().map(extractNodeText).join('').trim()
}

async function writeClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(ta)
  if (!ok) throw new Error('copy failed')
}

const handleCopy = async () => {
  if (props.disabled || props.loading || !copyOpts.value) return
  const text = getTextContent()
  if (!text) return
  try {
    await writeClipboard(text)
    copied.value = true
    copyStatus.value = t(LocaleKeys.tip.copied)
    emit('copy', text)
    trackEmit({
      component: 'Typography',
      type: 'copy',
      trackId: props.trackId,
      telemetry: props.telemetry
    })
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
      copyStatus.value = ''
    }, 2000)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    copyStatus.value = t(LocaleKeys.error.generic)
    trackEmit({
      component: 'Typography',
      type: 'copyError',
      category: 'error',
      trackId: props.trackId,
      telemetry: props.telemetry,
      severity: 'error'
    })
    emit('copyError', error)
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copyStatus.value = ''
    }, 2000)
  }
}

const onRootClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  if (props.clickable) {
    trackEmit({
      component: 'Typography',
      type: 'click',
      trackId: props.trackId,
      telemetry: props.telemetry
    })
    emit('click', event)
  }
}

const onRootKeydown = (event: KeyboardEvent) => {
  if (props.disabled || props.loading) return
  if (!copyOpts.value) return
  const isCopy =
    (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c' && !window.getSelection()?.toString()
  if (isCopy) {
    event.preventDefault()
    void handleCopy()
    return
  }
  if (!copyOpts.value.icon && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    void handleCopy()
  }
}

const checkOverflow = () => {
  const el = contentRef.value
  if (!el || !ellipsisOpts.value) {
    isOverflowing.value = false
    return
  }
  const rows = ellipsisOpts.value.rows ?? 1
  if (rows <= 1) {
    isOverflowing.value = el.scrollWidth > el.clientWidth + 1
  } else {
    isOverflowing.value = el.scrollHeight > el.clientHeight + 1
  }
}

onMounted(() => {
  nextTick(checkOverflow)
})

watch(
  () => [props.content, ellipsisOpts.value?.rows, resolvedType.value] as const,
  () => nextTick(checkOverflow)
)

onUnmounted(() => {
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <component
    :is="tagName"
    :class="typographyClass"
    :style="typographyStyle"
    :title="tooltipTitle"
    :aria-disabled="disabled || undefined"
    :aria-busy="loading || undefined"
    :tabindex="
      clickable || (copyOpts && !copyOpts.icon) ? (disabled || loading ? -1 : 0) : undefined
    "
    :role="clickable ? 'button' : undefined"
    @click="onRootClick"
    @keydown="onRootKeydown"
  >
    <span ref="contentRef" class="vp-typography__content">
      <slot>{{ content }}</slot>
    </span>
    <button
      v-if="copyOpts?.icon"
      type="button"
      class="vp-typography__copy"
      :class="{ 'vp-typography__copy--done': copied }"
      :aria-label="copyLabel"
      :title="copyLabel"
      :disabled="disabled || loading"
      @click.stop="handleCopy"
    >
      <svg
        v-if="!copied"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </button>
    <span class="vp-typography__status" role="status" aria-live="polite">{{ copyStatus }}</span>
  </component>
</template>
