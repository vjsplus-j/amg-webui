<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { toLabelSeries, chartColor } from '@amg-webui/utils/data-display/chartHelpers'
import type { BarChartEmits, BarChartProps } from './types'
import { useBarChartSelection } from './useBarChartSelection'
import './style.scss'

const props = withDefaults(defineProps<BarChartProps>(), {
  data: () => [],
  height: 160,
  showValues: true,
  selectable: true
})
const emit = defineEmits<BarChartEmits>()
const { t } = useLocale()
const { isSelected, selectItem } = useBarChartSelection(props, emit)

const items = computed(() =>
  toLabelSeries(props.data).map((item, index) => ({
    ...item,
    index
  }))
)
const hasData = computed(() => items.value.length > 0)
const max = computed(() => Math.max(1, props.max ?? 0, ...items.value.map((item) => item.value)))
const bars = computed(() => {
  const w = 360
  const h = props.height
  const gap = 8
  const bw = (w - gap * (items.value.length + 1)) / Math.max(1, items.value.length)
  return items.value.map((item, i) => ({
    x: gap + i * (bw + gap),
    y: h - 12 - (item.value / max.value) * (h - 24),
    w: bw,
    h: (item.value / max.value) * (h - 24),
    color: chartColor(i),
    ...item
  }))
})
const titleText = computed(() => props.title ?? t('component.bar-chart.title'))
const emptyText = computed(() => props.emptyText ?? t('common.noData'))

function onKeydown(event: KeyboardEvent, item: { label: string; value: number; index: number }) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  selectItem(item)
}
</script>

<template>
  <div
    :class="['vp-bar-chart', 'vp-bar-chart__panel', { 'vp-bar-chart--disabled': disabled, 'vp-bar-chart--loading': loading }, props.class]"
    :style="style"
    data-component="BarChart"
    role="group"
    :aria-label="titleText"
    :aria-busy="loading || undefined"
  >
    <h3 class="vp-bar-chart__title">{{ titleText }}</h3>
    <p v-if="description" class="vp-bar-chart__muted">{{ description }}</p>
    <p v-if="loading" class="vp-bar-chart__muted" role="status">{{ t('common.loading') }}</p>
    <p v-else-if="!hasData" class="vp-bar-chart__muted" role="status">{{ emptyText }}</p>
    <svg v-else class="vp-bar-chart__chart" :viewBox="`0 0 360 ${height}`" role="img" :aria-label="titleText">
      <line x1="8" :y1="height - 12" x2="352" :y2="height - 12" stroke="var(--ds-border)" stroke-width="1" />
      <rect
        v-for="(b, i) in bars"
        :key="i"
        class="vp-bar-chart__bar"
        :class="{ 'vp-bar-chart__bar--selected': isSelected(b) }"
        :x="b.x"
        :y="b.y"
        :width="b.w"
        :height="b.h"
        :fill="b.color"
        :tabindex="disabled ? -1 : 0"
        :aria-label="`${b.label}: ${b.value}`"
        rx="2"
        role="button"
        @click="selectItem(b, $event)"
        @keydown="onKeydown($event, b)"
      >
        <title>{{ b.label }}: {{ b.value }}</title>
      </rect>
      <text
        v-for="(b, i) in bars"
        v-show="showValues"
        :key="'v' + i"
        class="vp-bar-chart__value"
        :x="b.x + b.w / 2"
        :y="Math.max(12, b.y - 4)"
        text-anchor="middle"
      >
        {{ b.value }}
      </text>
    </svg>
    <slot :items="items" :selected="modelValue" />
  </div>
</template>
