<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { HeatMapProps, HeatMapEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<HeatMapProps & { rows?: number; cols?: number }>(), {
  data: () => [],
  rows: 5,
  cols: 7
})
defineEmits<HeatMapEmits>()
const { t } = useLocale()

const matrix = computed(() => {
  const raw = Array.isArray(props.data) ? (props.data as number[]) : []
  const cells: { x: number; y: number; value: number }[] = []
  const r = props.rows
  const c = props.cols
  for (let y = 0; y < r; y++) {
    for (let x = 0; x < c; x++) {
      const idx = y * c + x
      cells.push({ x, y, value: Number(raw[idx] ?? (idx * 17 + 23) % 100) })
    }
  }
  return cells
})
const max = computed(() => Math.max(1, ...matrix.value.map((c) => c.value)))
const cellW = 32
const cellH = 24
const titleText = computed(() => props.title ?? t('component.heat-map.title'))
</script>

<template>
  <div :class="['vp-heat-map', 'vp-heat-map__panel', { 'vp-heat-map--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-heat-map__title">{{ titleText }}</h3>
    <svg class="vp-heat-map__chart" :viewBox="`0 0 ${cols * cellW + 16} ${rows * cellH + 16}`" role="img" :aria-label="titleText">
      <rect
        v-for="(cell, i) in matrix"
        :key="i"
        :x="8 + cell.x * cellW"
        :y="8 + cell.y * cellH"
        :width="cellW - 2"
        :height="cellH - 2"
        :fill="`color-mix(in srgb, var(--primary-500) ${cell.value / max * 100}%, var(--surface-2))`"
        rx="2"
      >
        <title>{{ cell.value }}</title>
      </rect>
    </svg>
    <slot />
  </div>
</template>
