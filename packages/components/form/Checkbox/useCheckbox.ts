import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { Size } from '@amg-webui/types'
import type { CheckboxGroupContext } from './types'

export interface UseCheckboxSource {
  modelValue?: boolean
  value?: unknown
  disabled?: boolean
  size?: Size
  indeterminate?: boolean
  class?: string
  group: CheckboxGroupContext | null
}

/**
 * Checkbox checked / group mode / size resolution.
 */
export function useCheckbox(source: MaybeRefOrGetter<UseCheckboxSource>) {
  const isGroupMode = computed(() => {
    const s = toValue(source)
    return s.group != null && s.value !== undefined
  })

  const isChecked = computed(() => {
    const s = toValue(source)
    if (isGroupMode.value && s.group) {
      return s.group.modelValue.includes(s.value)
    }
    return Boolean(s.modelValue)
  })

  const isDisabled = computed(() => {
    const s = toValue(source)
    return Boolean(s.disabled || s.group?.disabled)
  })

  const resolvedSize = computed((): Size => {
    const s = toValue(source)
    return s.size ?? s.group?.size ?? 'md'
  })

  const showIndeterminate = computed(() => {
    const s = toValue(source)
    return Boolean(s.indeterminate && !isChecked.value)
  })

  const rootClass = computed(() => {
    const s = toValue(source)
    return [
      'vp-checkbox',
      `vp-checkbox--${resolvedSize.value}`,
      {
        'vp-checkbox--disabled': isDisabled.value,
        'vp-checkbox--checked': isChecked.value,
        'vp-checkbox--indeterminate': showIndeterminate.value
      },
      s.class
    ]
  })

  return {
    isGroupMode,
    isChecked,
    isDisabled,
    resolvedSize,
    showIndeterminate,
    rootClass
  }
}
