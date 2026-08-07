import { computed } from 'vue'
import type { GaugeChartProps } from './types'

export function useGaugeValue(props: GaugeChartProps) {
  const min = computed(() => Number(props.min ?? 0))
  const max = computed(() => Math.max(min.value + 1, Number(props.max ?? 100)))
  const rawValue = computed(() => {
    if (props.modelValue != null) return props.modelValue
    const raw = Array.isArray(props.data) ? props.data[0] : props.data
    return Number(raw)
  })
  const value = computed(() => {
    const next = Number(rawValue.value)
    if (!Number.isFinite(next)) return min.value
    return Math.min(max.value, Math.max(min.value, next))
  })
  const percent = computed(() => (value.value - min.value) / Math.max(1, max.value - min.value))

  return {
    min,
    max,
    value,
    percent
  }
}
