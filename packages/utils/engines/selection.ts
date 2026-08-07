/**
 * ENG-002 Selection Model — active/selected/multi/search/clear.
 */
import { computed, ref, type Ref } from 'vue'

export type SelectionValue = string | number | boolean | null | undefined

export interface SelectionOption<T = SelectionValue> {
  value: T
  label: string
  disabled?: boolean
  [key: string]: unknown
}

export interface UseSelectionModelOptions<T = SelectionValue> {
  multiple?: Ref<boolean> | boolean
  modelValue: Ref<T | T[] | null | undefined>
  emitChange: (value: T | T[] | undefined) => void
}

export function useSelectionModel<T = SelectionValue>(
  options: UseSelectionModelOptions<T>
) {
  const multiple = computed(() =>
    typeof options.multiple === 'boolean'
      ? options.multiple
      : Boolean(options.multiple?.value)
  )
  const activeIndex = ref(-1)
  const query = ref('')

  function isSelected(value: T): boolean {
    const cur = options.modelValue.value
    if (multiple.value) {
      return Array.isArray(cur) && cur.includes(value)
    }
    return cur === value
  }

  function select(value: T) {
    if (multiple.value) {
      const cur = Array.isArray(options.modelValue.value)
        ? [...options.modelValue.value]
        : []
      const idx = cur.indexOf(value)
      if (idx >= 0) cur.splice(idx, 1)
      else cur.push(value)
      options.emitChange(cur)
    } else {
      options.emitChange(value)
    }
  }

  function clear() {
    options.emitChange(multiple.value ? ([] as T[]) : undefined)
  }

  function setActiveIndex(index: number) {
    activeIndex.value = index
  }

  return {
    multiple,
    activeIndex,
    query,
    isSelected,
    select,
    clear,
    setActiveIndex
  }
}
