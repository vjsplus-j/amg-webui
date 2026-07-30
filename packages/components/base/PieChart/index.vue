<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { toLabelSeries, pieSlices } from '@amg-webui/utils/data-display/chartHelpers'
import type { PieChartProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<PieChartProps>(), {
  data: () => [40, 25, 20, 15]
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', value: unknown): void
  (e: 'click', event: MouseEvent): void
}>()
const { t } = useLocale()

const items = computed(() => toLabelSeries(props.data))
const slices = computed(() => pieSlices(items.value, 120, 80, 64))
const titleText = computed(() => props.title ?? t('component.pie-chart.title'))

function onSliceClick(e: MouseEvent, index: number) {
  if (props.disabled) return
  const slice = slices.value[index]
  emit('click', e)
  emit('change', slice?.value)
  emit('update:modelValue', slice?.value)
}
</script>

<template>
  <div
    :class="['vp-pie-chart', 'vp-pie-chart__panel', { 'vp-pie-chart--disabled': disabled, 'vp-pie-chart--loading': loading }, props.class]"
    :style="style"
    data-component="PieChart"
    role="img"
    :aria-label="titleText"
    :aria-busy="loading"
  >
    <h3 class="vp-pie-chart__title">{{ titleText }}</h3>
    <p v-if="description" class="vp-pie-chart__desc">{{ description }}</p>
    <svg class="vp-pie-chart__chart" viewBox="0 0 240 160" aria-hidden="true">
      <path
        v-for="(s, i) in slices"
        :key="i"
        :d="s.path"
        :fill="s.color"
        class="vp-pie-chart__slice"
        tabindex="0"
        role="button"
        :aria-label="`${s.label}: ${s.value}`"
        @click="onSliceClick($event, i)"
        @keydown.enter="onSliceClick($event as unknown as MouseEvent, i)"
      >
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
