import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { Size } from '@amg-webui/types'

export interface UseSwitchSource {
  modelValue?: boolean
  disabled?: boolean
  loading?: boolean
  size?: Size
  inlinePrompt?: boolean
  activeText?: string
  inactiveText?: string
  ariaLabel?: string
  /** Resolved via locale when texts omitted */
  activeFallback: string
  inactiveFallback: string
}

/**
 * Switch state, size class, prompt + a11y helpers.
 */
export function useSwitch(source: MaybeRefOrGetter<UseSwitchSource>) {
  const isDisabled = computed(() => {
    const s = toValue(source)
    return Boolean(s.disabled || s.loading)
  })

  const resolvedSize = computed((): Size => toValue(source).size ?? 'md')

  const activeLabel = computed(() => {
    const s = toValue(source)
    return s.activeText ?? s.activeFallback
  })

  const inactiveLabel = computed(() => {
    const s = toValue(source)
    return s.inactiveText ?? s.inactiveFallback
  })

  const promptText = computed(() => {
    const s = toValue(source)
    return s.modelValue ? activeLabel.value : inactiveLabel.value
  })

  const switchAriaLabel = computed(() => {
    const s = toValue(source)
    return s.ariaLabel || promptText.value
  })

  const rootClass = computed(() => {
    const s = toValue(source)
    return [
      'vp-switch',
      `vp-switch--${resolvedSize.value}`,
      {
        'vp-switch--disabled': isDisabled.value,
        'vp-switch--loading': Boolean(s.loading),
        'vp-switch--checked': Boolean(s.modelValue)
      }
    ]
  })

  return {
    isDisabled,
    resolvedSize,
    activeLabel,
    inactiveLabel,
    promptText,
    switchAriaLabel,
    rootClass
  }
}
