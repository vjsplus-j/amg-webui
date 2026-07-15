<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { toLabelSeries, radarPolygon } from '@amg-webui/utils/data-display/chartHelpers'
import type { RadarChartProps, RadarChartEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<RadarChartProps>(), {
  data: () => [80, 65, 90, 55, 70]
})
defineEmits<RadarChartEmits>()
const { t } = useLocale()

const items = computed(() => toLabelSeries(props.data))
const values = computed(() => items.value.map((d) => d.value))
const maxVal = computed(() => Math.max(1, ...values.value))
const polygon = computed(() => radarPolygon(values.value, 120, 80, 56, maxVal.value))
const axes = computed(() =>
  items.value.map((d, i) => {
    const n = items.value.length
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    const x = 120 + 56 * Math.cos(angle)
    const y = 80 + 56 * Math.sin(angle)
    const lx = 120 + 68 * Math.cos(angle)
    const ly = 80 + 68 * Math.sin(angle)
    return { x, y, lx, ly, label: d.label }
  })
)
const titleText = computed(() => props.title ?? t('component.radar-chart.title'))
</script>

<template>
  <div :class="['vp-radar-chart', 'vp-radar-chart__panel', { 'vp-radar-chart--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-radar-chart__title">{{ titleText }}</h3>
    <svg class="vp-radar-chart__chart" viewBox="0 0 240 160" role="img" :aria-label="titleText">
      <polygon
        v-for="r in [0.25, 0.5, 0.75, 1]"
        :key="r"
        :points="radarPolygon(values.map(() => maxVal * r), 120, 80, 56, maxVal)"
        fill="none"
        stroke="var(--ds-border)"
        stroke-width="1"
      />
      <line v-for="(a, i) in axes" :key="i" x1="120" y1="80" :x2="a.x" :y2="a.y" stroke="var(--ds-border)" />
      <polygon v-if="polygon" :points="polygon" fill="color-mix(in srgb, var(--primary-500) 30%, transparent)" stroke="var(--primary-500)" stroke-width="2" />
      <text v-for="(a, i) in axes" :key="'t' + i" :x="a.lx" :y="a.ly" text-anchor="middle" font-size="9" fill="var(--text-secondary)">{{ a.label }}</text>
    </svg>
    <slot />
  </div>
</template>
