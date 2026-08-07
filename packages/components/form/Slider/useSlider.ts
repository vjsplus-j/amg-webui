import { computed, ref } from 'vue'
import type { SliderProps } from './types'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function snap(value: number, min: number, max: number, step: number): number {
  const snapped = min + Math.round((value - min) / step) * step
  return clamp(snapped, min, max)
}

export function useSlider(props: SliderProps) {
  const trackRef = ref<HTMLElement | null>(null)
  const dragging = ref<'low' | 'high' | 'single' | null>(null)

  const min = computed(() => props.min ?? 0)
  const max = computed(() => props.max ?? 100)
  const step = computed(() => props.step ?? 1)

  const values = computed((): [number, number] => {
    const mv = props.modelValue
    if (props.range) {
      const arr = Array.isArray(mv) ? mv : [min.value, max.value]
      return [clamp(arr[0], min.value, max.value), clamp(arr[1], min.value, max.value)]
    }
    const single = typeof mv === 'number' ? mv : min.value
    return [single, single]
  })

  const percentLow = computed(() => {
    const span = max.value - min.value || 1
    return ((values.value[0] - min.value) / span) * 100
  })

  const percentHigh = computed(() => {
    const span = max.value - min.value || 1
    return ((values.value[1] - min.value) / span) * 100
  })

  const rootClass = computed(() => [
    'vp-slider',
    {
      'vp-slider--disabled': props.disabled,
      'vp-slider--range': props.range
    },
    props.class
  ])

  function valueFromClientX(clientX: number): number {
    const track = trackRef.value
    if (!track) return min.value
    const rect = track.getBoundingClientRect()
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
    return snap(min.value + ratio * (max.value - min.value), min.value, max.value, step.value)
  }

  function emitValue(low: number, high: number) {
    if (props.range) {
      const ordered: [number, number] = low <= high ? [low, high] : [high, low]
      return ordered
    }
    return low
  }

  return {
    trackRef,
    dragging,
    min,
    max,
    values,
    percentLow,
    percentHigh,
    rootClass,
    valueFromClientX,
    emitValue,
    snap,
    clamp
  }
}
