<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GaugeChartProps, GaugeChartEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<GaugeChartProps & { min?: number; max?: number }>(), {
  data: () => 72,
  min: 0,
  max: 100
})
defineEmits<GaugeChartEmits>()
const { t } = useLocale()

const value = computed(() => {
  const raw = Array.isArray(props.data) ? props.data[0] : props.data
  return Math.min(props.max, Math.max(props.min, Number(raw) || 0))
})
const angle = computed(() => {
  const pct = (value.value - props.min) / Math.max(1, props.max - props.min)
  return -Math.PI + pct * Math.PI
})
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
</script>

<template>
  <div :class="['vp-gauge-chart', 'vp-gauge-chart__panel', { 'vp-gauge-chart--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-gauge-chart__title">{{ titleText }}</h3>
    <svg class="vp-gauge-chart__chart" viewBox="0 0 240 140" role="img" :aria-label="titleText">
      <path d="M 50 100 A 70 70 0 0 1 190 100" fill="none" stroke="var(--surface-2)" stroke-width="12" stroke-linecap="round" />
      <path
        d="M 50 100 A 70 70 0 0 1 190 100"
        fill="none"
        stroke="var(--primary-500)"
        stroke-width="12"
        stroke-linecap="round"
        :stroke-dasharray="`${(value - min) / (max - min) * 220} 220`"
      />
      <line x1="120" y1="100" :x2="needle.x" :y2="needle.y" stroke="var(--text-primary)" stroke-width="2" />
      <circle cx="120" cy="100" r="6" fill="var(--primary-500)" />
      <text x="120" y="125" text-anchor="middle" font-size="16" font-weight="700" fill="var(--text-primary)">{{ value }}</text>
    </svg>
    <slot />
  </div>
</template>
