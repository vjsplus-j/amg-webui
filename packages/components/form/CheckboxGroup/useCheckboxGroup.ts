import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { Size } from '@amg-webui/types'
import type { CheckboxOption } from './types'

export interface UseCheckboxGroupSource {
  direction?: 'horizontal' | 'vertical'
  size?: Size
  disabled?: boolean
  options?: CheckboxOption[]
  modelValue?: unknown[]
  max?: number
  min?: number
  class?: string
}

/**
 * CheckboxGroup layout + selection limit helpers.
 */
export function useCheckboxGroup(source: MaybeRefOrGetter<UseCheckboxGroupSource>) {
  const orientation = computed(() =>
    toValue(source).direction === 'vertical' ? 'vertical' : 'horizontal'
  )

  const resolvedSize = computed((): Size => toValue(source).size ?? 'md')

  const optionList = computed(() => toValue(source).options ?? [])

  const selectedCount = computed(() => (toValue(source).modelValue ?? []).length)

  const atMax = computed(() => {
    const s = toValue(source)
    return s.max != null && selectedCount.value >= s.max
  })

  const rootClass = computed(() => {
    const s = toValue(source)
    return [
      'vp-checkboxgroup',
      `vp-checkboxgroup--${s.direction ?? 'horizontal'}`,
      `vp-checkboxgroup--size-${resolvedSize.value}`,
      {
        'vp-checkboxgroup--disabled': Boolean(s.disabled),
        'vp-checkboxgroup--at-max': atMax.value
      },
      s.class
    ]
  })

  return {
    orientation,
    resolvedSize,
    optionList,
    selectedCount,
    atMax,
    rootClass
  }
}
