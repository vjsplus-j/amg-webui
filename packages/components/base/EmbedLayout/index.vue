<script setup lang="ts">
import { computed } from 'vue'
import type { EmbedLayoutProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<EmbedLayoutProps>(), {
  aspectRatio: '16 / 9',
  fill: false,
  rounded: true,
  bordered: true,
  objectFit: 'cover'
})

const emit = defineEmits<{
  (e: 'frame-click', event: MouseEvent): void
}>()

const ASPECT_PRESETS: Record<string, string> = {
  '16/9': '16 / 9',
  '16 / 9': '16 / 9',
  '4/3': '4 / 3',
  '4 / 3': '4 / 3',
  '1/1': '1 / 1',
  '1 / 1': '1 / 1',
  '21/9': '21 / 9',
  '21 / 9': '21 / 9',
  '3/2': '3 / 2',
  '3 / 2': '3 / 2',
  '9/16': '9 / 16',
  '9 / 16': '9 / 16'
}

const resolvedAspect = computed(() => {
  const raw = String(props.aspectRatio ?? '16 / 9')
  return ASPECT_PRESETS[raw] ?? raw
})

const rootClass = computed(() => [
  'vp-embed-layout',
  `vp-embed-layout--fit-${props.objectFit}`,
  {
    'vp-embed-layout--rounded': props.rounded,
    'vp-embed-layout--bordered': props.bordered,
    'vp-embed-layout--fill': props.fill
  },
  props.class
])

const rootStyle = computed(() => {
  const s: Record<string, string> = {
    ...(props.style ?? {}),
    '--vp-embed-fit': props.objectFit
  }
  if (!props.fill) {
    s.aspectRatio = resolvedAspect.value
  }
  return s
})

function onFrameClick(e: MouseEvent) {
  emit('frame-click', e)
}
</script>

<template>
  <div
    :class="rootClass"
    :style="rootStyle"
    data-component="EmbedLayout"
    role="figure"
    :aria-label="label ?? String(aspectRatio)"
  >
    <div class="vp-embed-layout__frame" @click="onFrameClick">
      <slot />
    </div>
  </div>
</template>
