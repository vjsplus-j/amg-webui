import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { InputNumberProps } from './types'

function clamp(value: number, min?: number, max?: number): number {
  let result = value
  if (min != null && result < min) result = min
  if (max != null && result > max) result = max
  return result
}

function applyPrecision(value: number, precision?: number): number {
  if (precision == null) return value
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

export function useInputNumber(
  props: InputNumberProps,
  state?: {
    invalid?: MaybeRefOrGetter<boolean>
    disabled?: MaybeRefOrGetter<boolean>
  }
) {
  const step = computed(() => props.step ?? 1)
  const precision = computed(() => props.precision)

  const rootClass = computed(() => [
    'vp-inputnumber',
    `vp-inputnumber--${props.size ?? 'md'}`,
    {
      'vp-inputnumber--fluid': props.fluid,
      'vp-inputnumber--disabled': props.disabled || toValue(state?.disabled),
      'vp-inputnumber--invalid': props.invalid || toValue(state?.invalid),
      'vp-inputnumber--controls': props.controls !== false
    },
    props.class
  ])

  function normalize(raw: number | null): number | null {
    if (raw == null || Number.isNaN(raw)) return null
    const clamped = clamp(raw, props.min, props.max)
    return applyPrecision(clamped, precision.value)
  }

  function increment(current: number | null | undefined): number | null {
    const base = current ?? props.min ?? 0
    return normalize(base + step.value)
  }

  function decrement(current: number | null | undefined): number | null {
    const base = current ?? props.min ?? 0
    return normalize(base - step.value)
  }

  function parseInput(value: string): number | null {
    if (value.trim() === '') return null
    const parsed = Number(value)
    if (Number.isNaN(parsed)) return null
    return normalize(parsed)
  }

  return { rootClass, increment, decrement, parseInput, normalize }
}
