<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import type { ProgressEmits, ProgressStatus, ProgressType } from './types'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

defineOptions({ inheritAttrs: false })

/** Inline â€?imported `ProgressProps` is not expanded into runtime props. */
const props = withDefaults(
  defineProps<{
    percentage: number
    type?: ProgressType
    status?: ProgressStatus
    showText?: boolean
    /** Stroke thickness â€?Size token CSS var or CSS length */
    strokeWidth?: number | string
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    telemetry: undefined,
    type: 'line',
    status: 'normal',
    showText: true
  }
)

const emit = defineEmits<ProgressEmits>()

const clampedPercentage = computed(() =>
  Math.min(100, Math.max(0, Number(props.percentage) || 0))
)

const finished = ref(false)

watch(
  clampedPercentage,
  (pct, prev) => {
    const raw = Number(props.percentage)
    if (!Number.isFinite(raw) || raw < 0 || raw > 100) {
      trackEmit({
        component: 'Progress',
        type: 'abnormal',
        category: 'alert',
        trackId: props.trackId,
        telemetry: props.telemetry,
        payload: { percentage: props.percentage, clamped: pct }
      })
    }
    if (prev !== undefined && pct !== prev) {
      trackEmit({
        component: 'Progress',
        type: 'change',
        trackId: props.trackId,
        telemetry: props.telemetry,
        payload: { percentage: pct }
      })
      emit('change', pct)
    }
    if (pct >= 100) {
      if (!finished.value) {
        finished.value = true
        trackEmit({
          component: 'Progress',
          type: 'finish',
          trackId: props.trackId,
          telemetry: props.telemetry
        })
        emit('finish')
      }
    } else {
      finished.value = false
    }
  },
  { immediate: true }
)

const progressClass = computed(() => [
  'vp-progress',
  `vp-progress--${props.type}`,
  `vp-progress--${props.status}`,
  props.class
])

function resolveStroke(raw: number | string | undefined): string | undefined {
  if (raw == null || raw === '') return undefined
  if (typeof raw === 'number') {
    /* Map 1â€? â†?spacing steps (avoid raw px in CSS) */
    const steps = [
      'var(--spacing-xs)',
      'var(--spacing-sm)',
      'var(--spacing-md)',
      'var(--spacing-lg)'
    ] as const
    return steps[Math.min(Math.max(Math.floor(raw), 1), 4) - 1]
  }
  return String(raw)
}

const progressStyle = computed(() => {
  const stroke = resolveStroke(props.strokeWidth)
  return {
    ...props.style,
    ...(stroke ? { '--vp-progress-stroke': stroke } : {})
  }
})

const barStyle = computed(() => ({
  width: `${clampedPercentage.value}%`
}))

const circleSize = computed(() => 'var(--height-xl)')
const circleRadius = computed(() => 18)
const circumference = computed(() => 2 * Math.PI * circleRadius.value)
const strokeDashoffset = computed(
  () => circumference.value * (1 - clampedPercentage.value / 100)
)
</script>

<template>
  <div
    :class="progressClass"
    :style="progressStyle"
    role="progressbar"
    :aria-valuenow="clampedPercentage"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <template v-if="type === 'line'">
      <div class="vp-progress__outer">
        <div class="vp-progress__inner" :style="barStyle" />
      </div>
      <span v-if="showText" class="vp-progress__text">{{ clampedPercentage }}%</span>
    </template>
    <template v-else>
      <svg
        class="vp-progress__circle"
        :width="circleSize"
        :height="circleSize"
        viewBox="0 0 44 44"
        aria-hidden="true"
      >
        <circle
          class="vp-progress__track"
          cx="22"
          cy="22"
          :r="circleRadius"
          fill="none"
        />
        <circle
          class="vp-progress__arc"
          cx="22"
          cy="22"
          :r="circleRadius"
          fill="none"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
        />
      </svg>
      <span v-if="showText" class="vp-progress__circle-text">{{ clampedPercentage }}%</span>
    </template>
  </div>
</template>
