<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { toNumberSeries } from '@amg-webui/utils/data-display/chartHelpers'
import type { LineChartProps, LineChartEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<LineChartProps>(), {
  data: () => [30, 45, 38, 62, 55, 72, 68]
})
defineEmits<LineChartEmits>()
const { t } = useLocale()

const series = computed(() => toNumberSeries(props.data))
const max = computed(() => Math.max(1, ...series.value))
const points = computed(() => {
  const w = 360
  const h = 160
  const pad = 12
  const vals = series.value
  if (!vals.length) return ''
  return vals
    .map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / Math.max(1, vals.length - 1)
      const y = h - pad - (v / max.value) * (h - pad * 2)
      return `${x},${y}`
    })
    .join(' ')
})
const area = computed(() => {
  if (!points.value) return ''
  const first = points.value.split(' ')[0]
  const last = points.value.split(' ').pop()
  return `${first} ${points.value} ${last?.split(',')[0]},148 12,148`
})
const titleText = computed(() => props.title ?? t('component.line-chart.title'))
</script>

<template>
  <div :class="['vp-line-chart', 'vp-line-chart__panel', { 'vp-line-chart--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-line-chart__title">{{ titleText }}</h3>
    <svg class="vp-line-chart__chart" viewBox="0 0 360 160" role="img" :aria-label="titleText">
      <polygon v-if="area" :points="area" fill="color-mix(in srgb, var(--primary-500) 20%, transparent)" />
      <polyline v-if="points" fill="none" stroke="var(--primary-500)" stroke-width="2" :points="points" />
      <circle
        v-for="(v, i) in series"
        :key="i"
        :cx="12 + (i * 336) / Math.max(1, series.length - 1)"
        :cy="148 - 12 - (v / max) * 136"
        r="3"
        fill="var(--primary-500)"
      >
        <title>{{ v }}</title>
      </circle>
    </svg>
    <slot />
  </div>
</template>
