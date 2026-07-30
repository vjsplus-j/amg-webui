<script setup lang="ts">
import { computed, ref } from 'vue'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

const props = withDefaults(
  defineProps<{
    height?: string | number
    maxHeight?: string | number
    native?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    native: false,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  scroll: [event: Event]
}>()

const wrapRef = ref<HTMLElement | null>(null)

function toCssSize(val?: string | number): string | undefined {
  if (val == null) return undefined
  if (typeof val === 'number') {
    return `calc(var(--spacing-xs) * ${Math.max(0, val)})`
  }
  return val
}

const wrapStyle = computed(() => ({
  ...(props.style ?? {}),
  height: toCssSize(props.height),
  maxHeight: toCssSize(props.maxHeight)
}))

function onScroll(event: Event) {
  trackEmit({
    component: 'Scrollbar',
    type: 'scroll',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
  emit('scroll', event)
}

function scrollTo(options: ScrollToOptions | number, y?: number) {
  const el = wrapRef.value
  if (!el) return
  if (typeof options === 'number') {
    el.scrollTo(options, y ?? 0)
  } else {
    el.scrollTo(options)
  }
}

defineExpose({ scrollTo, wrapRef })
</script>

<template>
  <div
    ref="wrapRef"
    :class="[
      'vp-scrollbar',
      { 'vp-scrollbar--native': native },
      props.class
    ]"
    :style="wrapStyle"
    @scroll="onScroll"
  >
    <div class="vp-scrollbar__view">
      <slot />
    </div>
  </div>
</template>
