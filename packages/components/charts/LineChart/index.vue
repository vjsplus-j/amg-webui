<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { toLabelSeries } from '@amg-webui/utils/data-display/chartHelpers'
import { trackEmit } from '@amg-webui/telemetry'
import type { LineChartItem, LineChartProps, LineChartEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<LineChartProps>(), {
  data: () => [],
  disabled: false,
  loading: false,
  height: 160,
  showArea: true,
  showPoints: true,
  selectable: true,
  telemetry: undefined
})
const emit = defineEmits<LineChartEmits>()
const { t } = useLocale()

const items = computed<LineChartItem[]>(() =>
  toLabelSeries(props.data).map((item, index) => ({ ...item, index }))
)
const hasData = computed(() => items.value.length > 0)
const maxValue = computed(() => Math.max(1, props.max ?? 0, ...items.value.map((item) => item.value)))
const baseline = computed(() => props.height - 12)
const pointItems = computed(() => {
  const pad = 12
  return items.value.map((item, index) => ({
    ...item,
    x: pad + (index * (360 - pad * 2)) / Math.max(1, items.value.length - 1),
    y: baseline.value - (item.value / maxValue.value) * (props.height - pad * 2)
  }))
})
const points = computed(() => {
  return pointItems.value.map((item) => `${item.x},${item.y}`).join(' ')
})
const area = computed(() => {
  if (!points.value) return ''
  const first = pointItems.value[0]
  const last = pointItems.value.at(-1)
  return `${first?.x},${baseline.value} ${points.value} ${last?.x},${baseline.value}`
})
const titleText = computed(() => props.title ?? t('component.line-chart.title'))
const emptyText = computed(() => props.emptyText ?? t('common.noData'))

function selectPoint(item: LineChartItem, event?: MouseEvent | KeyboardEvent) {
  if (props.disabled || props.loading || !props.selectable) return
  trackEmit({
    component: 'LineChart',
    type: 'select',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { label: item.label, value: item.value, index: item.index }
  })
  emit('update:modelValue', item.label)
  emit('change', item)
  emit('select', item, event)
  if (event instanceof MouseEvent) emit('click', event)
}

</script>

<template>
  <div
    :class="['vp-line-chart', 'vp-line-chart__panel', { 'vp-line-chart--disabled': disabled, 'vp-line-chart--loading': loading }, props.class]"
    :style="style"
    data-component="LineChart"
    role="group"
    :aria-label="titleText"
    :aria-busy="loading || undefined"
  >
    <h3 class="vp-line-chart__title">{{ titleText }}</h3>
    <p v-if="description" class="vp-line-chart__muted">{{ description }}</p>
    <p v-if="loading" class="vp-line-chart__muted" role="status">{{ t('common.loading') }}</p>
    <p v-else-if="!hasData" class="vp-line-chart__muted" role="status">{{ emptyText }}</p>
    <svg v-else class="vp-line-chart__chart" :viewBox="`0 0 360 ${height}`">
      <line x1="12" :y1="baseline" x2="348" :y2="baseline" stroke="var(--ds-border)" stroke-width="1" />
      <polygon v-if="showArea && area" class="vp-line-chart__area" :points="area" />
      <polyline v-if="points" fill="none" stroke="var(--primary-500)" stroke-width="2" :points="points" />
      <circle
        v-for="item in pointItems"
        v-show="showPoints"
        :key="item.index"
        class="vp-line-chart__point"
        :class="{ 'vp-line-chart__point--selected': modelValue === item.label }"
        :cx="item.x"
        :cy="item.y"
        r="3"
        :aria-label="`${item.label}: ${item.value}`"
        @click="selectPoint(item, $event)"
      >
        <title>{{ item.label }}: {{ item.value }}</title>
      </circle>
    </svg>
    <slot :items="items" :selected="modelValue" />
  </div>
</template>
