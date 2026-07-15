<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { toLabelSeries, pieSlices } from '@amg-webui/utils/data-display/chartHelpers'
import type { PieChartProps, PieChartEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<PieChartProps>(), {
  data: () => [40, 25, 20, 15]
})
defineEmits<PieChartEmits>()
const { t } = useLocale()

const items = computed(() => toLabelSeries(props.data))
const slices = computed(() => pieSlices(items.value, 120, 80, 64))
const titleText = computed(() => props.title ?? t('component.pie-chart.title'))
</script>

<template>
  <div :class="['vp-pie-chart', 'vp-pie-chart__panel', { 'vp-pie-chart--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-pie-chart__title">{{ titleText }}</h3>
    <svg class="vp-pie-chart__chart" viewBox="0 0 240 160" role="img" :aria-label="titleText">
      <path v-for="(s, i) in slices" :key="i" :d="s.path" :fill="s.color">
        <title>{{ s.label }}: {{ s.value }}</title>
      </path>
      <g class="vp-pie-chart__legend">
        <g v-for="(s, i) in slices" :key="'leg-' + i" :transform="`translate(200 ${16 + i * 18})`">
          <rect width="10" height="10" :fill="s.color" rx="1" />
          <text x="14" y="9" font-size="10" fill="var(--text-secondary)">{{ s.label }}</text>
        </g>
      </g>
    </svg>
    <slot />
  </div>
</template>
