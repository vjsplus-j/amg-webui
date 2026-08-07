<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { toLabelSeries, radarPolygon } from '@amg-webui/utils/data-display/chartHelpers'
import type { RadarChartEmits, RadarChartProps } from './types'
import { useRadarChartSelection } from './useRadarChartSelection'
import './style.scss'

const props = withDefaults(defineProps<RadarChartProps>(), {
  data: () => [],
  levels: 4,
  showValues: true,
  selectable: true
})
const emit = defineEmits<RadarChartEmits>()
const { t } = useLocale()
const { isSelected, selectItem } = useRadarChartSelection(props, emit)

const items = computed(() => toLabelSeries(props.data).map((item, index) => ({ ...item, index })))
const hasData = computed(() => items.value.length > 2)
const values = computed(() => items.value.map((d) => d.value))
const maxVal = computed(() => Math.max(1, props.max ?? 0, ...values.value))
const polygon = computed(() => radarPolygon(values.value, 120, 80, 56, maxVal.value))
const levelList = computed(() =>
  Array.from({ length: Math.max(1, props.levels) }, (_, i) => (i + 1) / Math.max(1, props.levels))
)
const axes = computed(() =>
  items.value.map((d, i) => {
    const n = items.value.length
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    const axisX = 120 + 56 * Math.cos(angle)
    const axisY = 80 + 56 * Math.sin(angle)
    const labelX = 120 + 68 * Math.cos(angle)
    const labelY = 80 + 68 * Math.sin(angle)
    const pointX = 120 + ((d.value / maxVal.value) * 56) * Math.cos(angle)
    const pointY = 80 + ((d.value / maxVal.value) * 56) * Math.sin(angle)
    return { ...d, axisX, axisY, labelX, labelY, pointX, pointY }
  })
)
const titleText = computed(() => props.title ?? t('component.radar-chart.title'))
const emptyText = computed(() => props.emptyText ?? t('common.noData'))
</script>

<template>
  <div
    :class="['vp-radar-chart', 'vp-radar-chart__panel', { 'vp-radar-chart--disabled': disabled, 'vp-radar-chart--loading': loading }, props.class]"
    :style="style"
    data-component="RadarChart"
    role="group"
    :aria-label="titleText"
  >
    <h3 class="vp-radar-chart__title">{{ titleText }}</h3>
    <p v-if="description" class="vp-radar-chart__muted">{{ description }}</p>
    <p v-if="loading" class="vp-radar-chart__muted" role="status" aria-busy="true">{{ t('common.loading') }}</p>
    <p v-else-if="!hasData" class="vp-radar-chart__muted" role="status">{{ emptyText }}</p>
    <svg v-else class="vp-radar-chart__chart" viewBox="0 0 240 160">
      <polygon
        v-for="r in levelList"
        :key="r"
        :points="radarPolygon(values.map(() => maxVal * r), 120, 80, 56, maxVal)"
        fill="none"
        stroke="var(--ds-border)"
        stroke-width="1"
      />
      <line v-for="(a, i) in axes" :key="'a' + i" x1="120" y1="80" :x2="a.axisX" :y2="a.axisY" stroke="var(--ds-border)" />
      <polygon v-if="polygon" :points="polygon" fill="color-mix(in srgb, var(--primary-500) 30%, transparent)" stroke="var(--primary-500)" stroke-width="2" />
      <circle
        v-for="(a, i) in axes"
        :key="'p' + i"
        class="vp-radar-chart__point"
        :class="{ 'vp-radar-chart__point--selected': isSelected(a) }"
        :cx="a.pointX"
        :cy="a.pointY"
        r="4"
        @click="selectItem(a, $event)"
      />
      <text v-for="(a, i) in axes" :key="'t' + i" :x="a.labelX" :y="a.labelY" text-anchor="middle" font-size="9" fill="var(--text-secondary)">{{ a.label }}</text>
      <text v-for="(a, i) in axes" v-show="showValues" :key="'v' + i" :x="a.pointX" :y="a.pointY - 6" text-anchor="middle" class="vp-radar-chart__value">{{ a.value }}</text>
    </svg>
    <slot :items="items" :selected="modelValue" />
  </div>
</template>
