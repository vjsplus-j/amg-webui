<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { toNumberSeries, chartColor } from '@amg-webui/utils/data-display/chartHelpers'
import type { BarChartProps, BarChartEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<BarChartProps>(), {
  data: () => [40, 65, 30, 80, 55, 70]
})
defineEmits<BarChartEmits>()
const { t } = useLocale()

const series = computed(() => toNumberSeries(props.data))
const max = computed(() => Math.max(1, ...series.value))
const bars = computed(() => {
  const vals = series.value
  const w = 360
  const h = 160
  const gap = 8
  const bw = (w - gap * (vals.length + 1)) / Math.max(1, vals.length)
  return vals.map((v, i) => ({
    x: gap + i * (bw + gap),
    y: h - 12 - (v / max.value) * (h - 24),
    w: bw,
    h: (v / max.value) * (h - 24),
    color: chartColor(i),
    value: v
  }))
})
const titleText = computed(() => props.title ?? t('component.bar-chart.title'))
</script>

<template>
  <div :class="['vp-bar-chart', 'vp-bar-chart__panel', { 'vp-bar-chart--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-bar-chart__title">{{ titleText }}</h3>
    <svg class="vp-bar-chart__chart" viewBox="0 0 360 160" role="img" :aria-label="titleText">
      <line x1="8" y1="148" x2="352" y2="148" stroke="var(--ds-border)" stroke-width="1" />
      <rect
        v-for="(b, i) in bars"
        :key="i"
        :x="b.x"
        :y="b.y"
        :width="b.w"
        :height="b.h"
        :fill="b.color"
        rx="2"
      >
        <title>{{ b.value }}</title>
      </rect>
    </svg>
    <slot />
  </div>
</template>
