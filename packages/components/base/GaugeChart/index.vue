<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GaugeChartEmits, GaugeChartProps } from './types'
import { useGaugeValue } from './useGaugeValue'
import './style.scss'

const props = withDefaults(defineProps<GaugeChartProps>(), {
  data: () => 72,
  min: 0,
  max: 100,
  showValue: true,
  thresholds: () => []
})
const emit = defineEmits<GaugeChartEmits>()
const { t } = useLocale()
const { min, max, value, percent } = useGaugeValue(props)

const angle = computed(() => -Math.PI + percent.value * Math.PI)
const needle = computed(() => {
  const cx = 120
  const cy = 100
  const r = 70
  return {
    x: cx + r * Math.cos(angle.value),
    y: cy + r * Math.sin(angle.value)
  }
})
const titleText = computed(() => props.title ?? t('component.gauge-chart.title'))
const arcLength = computed(() => Math.max(0, Math.min(220, percent.value * 220)))
const valueText = computed(() => `${value.value}${props.unit ?? ''}`)
const emptyText = computed(() => props.emptyText ?? t('common.noData'))

function commitValue(next: number, event?: MouseEvent) {
  if (props.disabled || props.loading) return
  const clamped = Math.min(max.value, Math.max(min.value, next))
  emit('update:modelValue', clamped)
  emit('change', clamped)
  if (event) emit('click', event)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    event.preventDefault()
    commitValue(value.value + 1)
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    event.preventDefault()
    commitValue(value.value - 1)
  }
}
</script>

<template>
  <div
    :class="['vp-gauge-chart', 'vp-gauge-chart__panel', { 'vp-gauge-chart--disabled': disabled, 'vp-gauge-chart--loading': loading }, props.class]"
    :style="style"
    data-component="GaugeChart"
    role="group"
    :aria-label="titleText"
    :aria-busy="loading || undefined"
  >
    <h3 class="vp-gauge-chart__title">{{ titleText }}</h3>
    <p v-if="description" class="vp-gauge-chart__muted">{{ description }}</p>
    <p v-if="loading" class="vp-gauge-chart__muted" role="status">{{ t('common.loading') }}</p>
    <p v-else-if="data == null" class="vp-gauge-chart__muted" role="status">{{ emptyText }}</p>
    <svg
      v-else
      class="vp-gauge-chart__chart"
      viewBox="0 0 240 140"
      role="slider"
      :aria-label="titleText"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="value"
      tabindex="0"
      @click="commitValue(value, $event)"
      @keydown="onKeydown"
    >
      <path d="M 50 100 A 70 70 0 0 1 190 100" fill="none" stroke="var(--surface-2)" stroke-width="12" stroke-linecap="round" />
      <path
        d="M 50 100 A 70 70 0 0 1 190 100"
        fill="none"
        stroke="var(--primary-500)"
        stroke-width="12"
        stroke-linecap="round"
        :stroke-dasharray="`${arcLength} 220`"
      />
      <line x1="120" y1="100" :x2="needle.x" :y2="needle.y" stroke="var(--text-primary)" stroke-width="2" />
      <circle cx="120" cy="100" r="6" fill="var(--primary-500)" />
      <text v-if="showValue" x="120" y="125" text-anchor="middle" class="vp-gauge-chart__value">{{ valueText }}</text>
    </svg>
    <slot :value="value" :percent="percent" />
  </div>
</template>
