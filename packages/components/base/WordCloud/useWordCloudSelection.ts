import { computed } from 'vue'
import type { WordCloudEmits, WordCloudProps } from './types'

export interface WordCloudItem {
  label: string
  value: number
  index: number
}

export function useWordCloudSelection(props: WordCloudProps, emit: WordCloudEmits) {
  const selectedKey = computed(() => props.modelValue)

  function isSelected(item: WordCloudItem) {
    return selectedKey.value === item.label || selectedKey.value === item.index
  }

  function selectWord(item: WordCloudItem, event?: MouseEvent) {
    if (props.disabled || props.loading || props.selectable === false) return
    emit('update:modelValue', item.label)
    emit('change', item)
    if (event) emit('click', event)
  }

  return {
    selectedKey,
    isSelected,
    selectWord
  }
}
