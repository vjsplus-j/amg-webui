import { computed } from 'vue'
import type { RadarChartEmits, RadarChartProps } from './types'

export interface RadarChartItem {
  label: string
  value: number
  index: number
}

export function useRadarChartSelection(props: RadarChartProps, emit: RadarChartEmits) {
  const selectedKey = computed(() => props.modelValue)

  function isSelected(item: RadarChartItem) {
    return selectedKey.value === item.label || selectedKey.value === item.index
  }

  function selectItem(item: RadarChartItem, event?: MouseEvent) {
    if (props.disabled || props.loading || props.selectable === false) return
    emit('update:modelValue', item.label)
    emit('change', item)
    if (event) emit('click', event)
  }

  return {
    selectedKey,
    isSelected,
    selectItem
  }
}
