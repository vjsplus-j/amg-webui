<script setup lang="ts">
import { computed } from 'vue'
import Progress from '../Progress/index.vue'
import type { ProgressTipProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<ProgressTipProps>(), {
  percentage: 0,
  severity: 'info'
})

const pct = computed(() => Math.min(100, Math.max(0, props.percentage)))
const rootClass = computed(() => ['vp-progress-tip', `vp-progress-tip--${props.severity}`, props.class])
</script>

<template>
  <div :class="rootClass" :style="style" role="status">
    <p v-if="message || $slots.default" class="vp-progress-tip__message">
      <slot>{{ message }}</slot>
    </p>
    <Progress :percentage="pct" type="line" />
  </div>
</template>
