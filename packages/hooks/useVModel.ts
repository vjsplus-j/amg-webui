import { computed, type WritableComputedRef } from 'vue'

export function useVModel<T>(model: {
  value: T
}): {
  value: WritableComputedRef<T>
  updateValue: (val: T) => void
} {
  const value = computed({
    get: () => model.value,
    set: (val) => {
      model.value = val
    }
  })

  const updateValue = (val: T) => {
    value.value = val
  }

  return { value, updateValue }
}
