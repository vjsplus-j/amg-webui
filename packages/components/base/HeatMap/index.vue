<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { HeatMapEmits, HeatMapProps } from './types'
import { useHeatMapSelection } from './useHeatMapSelection'
import './style.scss'

const props = withDefaults(defineProps<HeatMapProps>(), {
  data: () => [],
  rows: 5,
  cols: 7,
  min: 0,
  showValues: false,
  selectable: true
})
const emit = defineEmits<HeatMapEmits>()
const { t } = useLocale()
const { isSelected, selectCell } = useHeatMapSelection(props, emit)

const matrix = computed(() => {
  const raw = Array.isArray(props.data) ? (props.data as number[]) : []
  const cells: { x: number; y: number; value: number; index: number }[] = []
  const r = Math.max(1, props.rows)
  const c = Math.max(1, props.cols)
  for (let y = 0; y < r; y++) {
    for (let x = 0; x < c; x++) {
      const idx = y * c + x
      cells.push({ x, y, index: idx, value: Number(raw[idx] ?? 0) })
    }
  }
  return cells
})
const hasData = computed(() => Array.isArray(props.data) && props.data.length > 0)
const max = computed(() => Math.max(1, props.max ?? 0, ...matrix.value.map((c) => c.value)))
const cellW = 32
const cellH = 24
const titleText = computed(() => props.title ?? t('component.heat-map.title'))
const emptyText = computed(() => props.emptyText ?? t('common.noData'))

function intensity(value: number) {
  const min = Number(props.min ?? 0)
  const pct = ((value - min) / Math.max(1, max.value - min)) * 100
  return Math.min(100, Math.max(0, pct))
}

function onKeydown(event: KeyboardEvent, cell: { x: number; y: number; value: number; index: number }) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  selectCell(cell)
}
</script>

<template>
  <div
    :class="['vp-heat-map', 'vp-heat-map__panel', { 'vp-heat-map--disabled': disabled, 'vp-heat-map--loading': loading }, props.class]"
    :style="style"
    data-component="HeatMap"
    role="group"
    :aria-label="titleText"
    :aria-busy="loading || undefined"
  >
    <h3 class="vp-heat-map__title">{{ titleText }}</h3>
    <p v-if="description" class="vp-heat-map__muted">{{ description }}</p>
    <p v-if="loading" class="vp-heat-map__muted" role="status">{{ t('common.loading') }}</p>
    <p v-else-if="!hasData" class="vp-heat-map__muted" role="status">{{ emptyText }}</p>
    <svg v-else class="vp-heat-map__chart" :viewBox="`0 0 ${cols * cellW + 16} ${rows * cellH + 16}`" role="img" :aria-label="titleText">
      <rect
        v-for="(cell, i) in matrix"
        :key="i"
        class="vp-heat-map__cell"
        :class="{ 'vp-heat-map__cell--selected': isSelected(cell) }"
        :x="8 + cell.x * cellW"
        :y="8 + cell.y * cellH"
        :width="cellW - 2"
        :height="cellH - 2"
        :fill="`color-mix(in srgb, var(--primary-500) ${intensity(cell.value)}%, var(--surface-2))`"
        :tabindex="disabled ? -1 : 0"
        role="button"
        :aria-label="`${t('common.rows')} ${cell.y + 1}, ${t('common.columns')} ${cell.x + 1}: ${cell.value}`"
        rx="2"
        @click="selectCell(cell, $event)"
        @keydown="onKeydown($event, cell)"
      >
        <title>{{ cell.value }}</title>
      </rect>
      <text
        v-for="(cell, i) in matrix"
        v-show="showValues"
        :key="'v' + i"
        class="vp-heat-map__value"
        :x="8 + cell.x * cellW + cellW / 2"
        :y="8 + cell.y * cellH + cellH / 2"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ cell.value }}
      </text>
    </svg>
    <slot :cells="matrix" :selected="modelValue" />
  </div>
</template>
