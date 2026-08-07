import { computed } from 'vue'
import type { HeatMapEmits, HeatMapProps } from './types'

export interface HeatMapCell {
  x: number
  y: number
  value: number
  index: number
}

export function useHeatMapSelection(props: HeatMapProps, emit: HeatMapEmits) {
  const selectedKey = computed(() => props.modelValue)

  function cellKey(cell: HeatMapCell) {
    return `${cell.x}:${cell.y}`
  }

  function isSelected(cell: HeatMapCell) {
    return selectedKey.value === cell.index || selectedKey.value === cellKey(cell)
  }

  function selectCell(cell: HeatMapCell, event?: MouseEvent) {
    if (props.disabled || props.loading || props.selectable === false) return
    emit('update:modelValue', cellKey(cell))
    emit('change', cell)
    if (event) emit('click', event)
  }

  return {
    cellKey,
    isSelected,
    selectCell
  }
}
