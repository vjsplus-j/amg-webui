import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import {
  MOTION_CLASS,
  formatMotionDuration,
  resolveMotionKind
} from '@amg-webui/animations/motion'
import type { MotionKind, MotionProps } from '@amg-webui/types'

export type { MotionKind, MotionProps }

export interface UseMotionSource extends MotionProps {
  /**
   * Force spin (e.g. Icon `loading`).
   * Does not apply to Avatar/Button loading skeletons / spinners.
   */
  forceSpin?: boolean
  /**
   * Also emit legacy Icon host classes (`vp-icon--*` / `p-icon-*`).
   * Default false — prefer `vp-motion--*`.
   */
  legacyIconClasses?: boolean
}

/**
 * Library-wide host motion (shared `vp-motion--*` kinds).
 * Put `motionClass` + `motionStyle` on the component root (or mark host).
 */
export function useMotion(source: MaybeRefOrGetter<UseMotionSource>) {
  const motionKind = computed<MotionKind | null>(() => {
    const s = toValue(source)
    return resolveMotionKind({
      spin: s.spin,
      pulse: s.pulse,
      heartbeat: s.heartbeat,
      bounce: s.bounce,
      blink: s.blink,
      breathe: s.breathe,
      glow: s.glow,
      marqueeLeft: s.marqueeLeft,
      marqueeRight: s.marqueeRight,
      scrollUp: s.scrollUp,
      scrollDown: s.scrollDown,
      dampOut: s.dampOut,
      forceSpin: s.forceSpin
    })
  })

  const motionClass = computed(() => {
    const kind = motionKind.value
    if (!kind) return [] as string[]
    const classes = [MOTION_CLASS[kind]]
    const s = toValue(source)
    if (s.legacyIconClasses) {
      classes.push(`vp-icon--${kind}`)
      if (kind === 'spin') classes.push('p-icon-spin')
      if (kind === 'pulse') classes.push('p-icon-pulse')
    }
    return classes
  })

  const motionStyle = computed(() => {
    const duration = formatMotionDuration(toValue(source).animationDuration)
    if (!duration) return {} as Record<string, string>
    return {
      '--vp-motion-duration': duration,
      '--vp-icon-anim-duration': duration
    }
  })

  return {
    motionKind,
    motionClass,
    motionStyle
  }
}
