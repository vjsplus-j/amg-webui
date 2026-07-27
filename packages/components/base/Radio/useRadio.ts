import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { Size } from '@amg-webui/types'
import type { RadioGroupContext } from './types'

export interface UseRadioSource {
  modelValue?: unknown
  value: unknown
  disabled?: boolean
  size?: Size
  name?: string
  label?: string
  class?: string
  group: RadioGroupContext | null
}

/**
 * Radio checked / disabled / size resolution (standalone or group).
 */
export function useRadio(source: MaybeRefOrGetter<UseRadioSource>) {
  const isChecked = computed(() => {
    const s = toValue(source)
    const current = s.group ? s.group.modelValue : s.modelValue
    return current === s.value
  })

  const isDisabled = computed(() => {
    const s = toValue(source)
    return Boolean(s.disabled || s.group?.disabled)
  })

  const inputName = computed(() => {
    const s = toValue(source)
    return s.group?.name ?? s.name
  })

  const resolvedSize = computed((): Size => {
    const s = toValue(source)
    return s.size ?? s.group?.size ?? 'md'
  })

  const rootClass = computed(() => {
    const s = toValue(source)
    return [
      'vp-radio',
      `vp-radio--${resolvedSize.value}`,
      {
        'vp-radio--disabled': isDisabled.value,
        'vp-radio--checked': isChecked.value
      },
      s.class
    ]
  })

  return {
    isChecked,
    isDisabled,
    inputName,
    resolvedSize,
    rootClass
  }
}
