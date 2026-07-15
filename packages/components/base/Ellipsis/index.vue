<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  useSlots
} from 'vue'
import type { EllipsisEmits, EllipsisProps } from './types'
import Tooltip from '../Tooltip/index.vue'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

const props = withDefaults(defineProps<EllipsisProps>(), {
  telemetry: undefined,
  lines: 1,
  tooltip: true,
  tooltipPlacement: 'top'
})

const emit = defineEmits<EllipsisEmits>()

const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)
const isOverflowing = ref(false)
const fullText = ref('')

let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null

const ellipsisStyle = computed(() => ({
  ...props.style,
  '--vp-ellipsis-lines': String(Math.max(1, props.lines))
}))

const ellipsisClass = computed(() => [
  'vp-ellipsis',
  {
    'vp-ellipsis--multiline': props.lines > 1,
    'vp-ellipsis--single': props.lines <= 1,
    'vp-ellipsis--focusable': props.tooltip && isOverflowing.value
  },
  props.class
])

const tooltipContent = computed(() => {
  if (props.content) return props.content
  return fullText.value
})

const showTooltip = computed(
  () => props.tooltip && isOverflowing.value && Boolean(tooltipContent.value)
)

function readText(): string {
  if (props.content) return props.content
  return rootRef.value?.textContent?.trim() ?? ''
}

function checkOverflow() {
  const el = rootRef.value
  if (!el) return
  fullText.value = readText()
  const next =
    props.lines <= 1
      ? el.scrollWidth > el.clientWidth + 1
      : el.scrollHeight > el.clientHeight + 1
  if (next !== isOverflowing.value) {
    isOverflowing.value = next
    trackEmit({
      component: 'Ellipsis',
      type: 'overflowChange',
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { overflowing: next }
    })
    emit('overflowChange', next)
  }
}

function bindObservers() {
  const el = rootRef.value
  if (!el || typeof ResizeObserver === 'undefined') return

  resizeObserver?.disconnect()
  resizeObserver = new ResizeObserver(() => checkOverflow())
  resizeObserver.observe(el)
  if (el.parentElement) resizeObserver.observe(el.parentElement)

  mutationObserver?.disconnect()
  mutationObserver = new MutationObserver(() => nextTick(checkOverflow))
  mutationObserver.observe(el, {
    characterData: true,
    childList: true,
    subtree: true
  })
}

onMounted(() => {
  nextTick(() => {
    checkOverflow()
    bindObservers()
  })
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
  resizeObserver = null
  mutationObserver = null
})

watch(
  () => [props.lines, props.content, props.tooltip] as const,
  () => nextTick(checkOverflow)
)

watch(
  () => slots.default,
  () => nextTick(checkOverflow)
)
</script>

<template>
  <span class="vp-ellipsis-wrap">
    <Tooltip
      :content="tooltipContent"
      :placement="tooltipPlacement"
      :disabled="!showTooltip"
      :style="{ whiteSpace: 'normal', maxWidth: '100%' }"
    >
      <span
        ref="rootRef"
        :class="ellipsisClass"
        :style="ellipsisStyle"
        :tabindex="showTooltip ? 0 : undefined"
      >
        <slot>{{ content }}</slot>
      </span>
    </Tooltip>
  </span>
</template>
