import { computed } from 'vue'
import type { BarChartEmits, BarChartProps } from './types'

export interface BarChartItem {
  label: string
  value: number
  index: number
}

export function useBarChartSelection(props: BarChartProps, emit: BarChartEmits) {
  const selectedKey = computed(() => props.modelValue)

  function isSelected(item: BarChartItem) {
    return selectedKey.value === item.label || selectedKey.value === item.index
  }

  function selectItem(item: BarChartItem, event?: MouseEvent) {
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
