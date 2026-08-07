<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import Icon from '@amg-webui/core/Icon/index.vue'
import type { StatisticEmits, StatisticProps } from './types'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

const props = withDefaults(defineProps<StatisticProps>(), {
  telemetry: undefined,
  groupSeparator: ',',
  decimalSeparator: '.',
  trend: 'none',
  animate: false,
  duration: 1000
})

const emit = defineEmits<StatisticEmits>()

const displayValue = ref<string>('')

function formatNumber(num: number): string {
  const precision = props.precision ?? (Number.isInteger(num) ? 0 : 2)
  const fixed = num.toFixed(precision)
  const [intPart, decPart] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator)
  return decPart !== undefined
    ? `${grouped}${props.decimalSeparator}${decPart}`
    : grouped
}

function resolveDisplayValue(raw: number | string): string {
  if (typeof raw === 'string') return raw
  return formatNumber(raw)
}

let rafId = 0
let startTime = 0
let startVal = 0
let targetVal = 0

function cancelAnimation() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
}

function runCountUp(target: number) {
  cancelAnimation()
  if (!props.animate || typeof props.value !== 'number') {
    displayValue.value = resolveDisplayValue(props.value)
    return
  }

  startVal = 0
  targetVal = target
  startTime = performance.now()

  const step = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    const current = startVal + (targetVal - startVal) * progress
    displayValue.value = formatNumber(current)
    if (progress < 1) {
      rafId = requestAnimationFrame(step)
    } else {
      rafId = 0
      trackEmit({
        component: 'Statistic',
        type: 'finish',
        trackId: props.trackId,
        telemetry: props.telemetry,
        payload: { value: targetVal }
      })
      emit('finish', targetVal)
    }
  }

  rafId = requestAnimationFrame(step)
}

watch(
  () => props.value,
  (val) => {
    if (typeof val === 'number' && props.animate) {
      runCountUp(val)
    } else {
      cancelAnimation()
      displayValue.value = resolveDisplayValue(val)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  cancelAnimation()
})

const rootClass = computed(() => [
  'vp-statistic',
  props.trend === 'up' ? 'vp-statistic--trend-up' : '',
  props.trend === 'down' ? 'vp-statistic--trend-down' : '',
  props.class
])
</script>

<template>
  <div :class="rootClass" :style="style">
    <div v-if="title || $slots.title" class="vp-statistic__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="vp-statistic__content">
      <span v-if="prefix || $slots.prefix" class="vp-statistic__prefix">
        <slot name="prefix">{{ prefix }}</slot>
      </span>
      <span class="vp-statistic__value">{{ displayValue }}</span>
      <span v-if="suffix || $slots.suffix" class="vp-statistic__suffix">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
      <span
        v-if="trend === 'up'"
        class="vp-statistic__trend vp-statistic__trend--up"
        aria-hidden="true"
      >
        <Icon name="TrendingUp" size="sm" />
      </span>
      <span
        v-else-if="trend === 'down'"
        class="vp-statistic__trend vp-statistic__trend--down"
        aria-hidden="true"
      >
        <Icon name="TrendingDown" size="sm" />
      </span>
    </div>
  </div>
</template>
