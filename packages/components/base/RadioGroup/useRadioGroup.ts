import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { Size } from '@amg-webui/types'
import type { RadioOption } from './types'

export interface UseRadioGroupSource {
  direction?: 'horizontal' | 'vertical'
  size?: Size
  disabled?: boolean
  options?: RadioOption[]
  class?: string
}

/**
 * RadioGroup layout classes + orientation for a11y.
 */
export function useRadioGroup(source: MaybeRefOrGetter<UseRadioGroupSource>) {
  const orientation = computed(() =>
    toValue(source).direction === 'vertical' ? 'vertical' : 'horizontal'
  )

  const resolvedSize = computed((): Size => toValue(source).size ?? 'md')

  const optionList = computed(() => toValue(source).options ?? [])

  const rootClass = computed(() => {
    const s = toValue(source)
    return [
      'vp-radiogroup',
      `vp-radiogroup--${s.direction ?? 'horizontal'}`,
      `vp-radiogroup--size-${resolvedSize.value}`,
      {
        'vp-radiogroup--disabled': Boolean(s.disabled)
      },
      s.class
    ]
  })

  return {
    orientation,
    resolvedSize,
    optionList,
    rootClass
  }
}
