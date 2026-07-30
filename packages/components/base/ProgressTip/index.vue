<script setup lang="ts">
import { computed, watch } from 'vue'
import Progress from '../Progress/index.vue'
import type { ProgressStatus } from '../Progress/types'
import type { ProgressTipProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<ProgressTipProps>(), {
  percentage: 0,
  severity: 'info',
  size: 'md',
  showText: true,
  striped: false
})

const emit = defineEmits<{
  (e: 'complete'): void
}>()

const pct = computed(() => Math.min(100, Math.max(0, props.percentage)))

watch(pct, (v, prev) => {
  if (prev != null && prev < 100 && v >= 100) emit('complete')
})

const progressStatus = computed<ProgressStatus>(() => {
  if (props.severity === 'danger') return 'danger'
  if (props.severity === 'warning') return 'warning'
  if (props.severity === 'success') return 'success'
  return 'normal'
})

const rootClass = computed(() => [
  'vp-progress-tip',
  `vp-progress-tip--${props.severity}`,
  `vp-progress-tip--size-${props.size}`,
  { 'vp-progress-tip--striped': props.striped },
  props.class
])
</script>

<template>
  <div :class="rootClass" :style="style" role="status" aria-live="polite" data-component="ProgressTip">
    <p v-if="message || $slots.default" class="vp-progress-tip__message">
      <slot>{{ message }}</slot>
    </p>
    <Progress
      :percentage="pct"
      type="line"
      :status="progressStatus"
      :show-text="showText"
      :stroke-width="size === 'sm' ? 4 : size === 'lg' ? 10 : 6"
    />
  </div>
</template>
