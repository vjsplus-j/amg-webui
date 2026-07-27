import { computed, onUnmounted, ref, watch, type MaybeRefOrGetter, toValue } from 'vue'
import { AnimationService } from '@amg-webui/animations'

export interface UseSpinSource {
  spinning?: boolean
  delay?: number
  tip?: string
  /** Fallback when `tip` is omitted (usually `t(common.loading)`). */
  tipFallback: string
  ariaLabel?: string
}

/**
 * Delayed spinning gate + tip / a11y helpers.
 * Honors AnimationService master switch (motion default on).
 */
export function useSpin(source: MaybeRefOrGetter<UseSpinSource>) {
  const delayedSpinning = ref(false)
  let timer: ReturnType<typeof setTimeout> | 0 = 0
  const motionTick = ref(0)

  const unsub = AnimationService.subscribe(() => {
    motionTick.value += 1
  })

  watch(
    () => {
      const s = toValue(source)
      return [s.spinning !== false, s.delay ?? 0] as const
    },
    ([spinning, delay]) => {
      if (timer) {
        clearTimeout(timer)
        timer = 0
      }
      if (!spinning) {
        delayedSpinning.value = false
        return
      }
      if (!delay) {
        delayedSpinning.value = true
        return
      }
      timer = setTimeout(() => {
        delayedSpinning.value = true
        timer = 0
      }, delay)
    },
    { immediate: true }
  )

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
    unsub()
  })

  const tipText = computed(() => {
    const s = toValue(source)
    return s.tip ?? s.tipFallback
  })

  const statusLabel = computed(() => {
    const s = toValue(source)
    return s.ariaLabel || tipText.value
  })

  const motionAllowed = computed(() => {
    void motionTick.value
    return AnimationService.isMotionAllowed()
  })

  return {
    delayedSpinning,
    tipText,
    statusLabel,
    motionAllowed
  }
}
