import type { MotionKind, MotionProps } from '@amg-webui/types'

export type { MotionKind, MotionProps }

/** Class map for each motion kind (host element). */
export const MOTION_CLASS: Record<MotionKind, string> = {
  spin: 'vp-motion--spin',
  bounce: 'vp-motion--bounce',
  heartbeat: 'vp-motion--heartbeat',
  marqueeLeft: 'vp-motion--marquee-left',
  marqueeRight: 'vp-motion--marquee-right',
  scrollUp: 'vp-motion--scroll-up',
  scrollDown: 'vp-motion--scroll-down',
  dampOut: 'vp-motion--damp-out',
  blink: 'vp-motion--blink',
  pulse: 'vp-motion--pulse',
  breathe: 'vp-motion--breathe',
  glow: 'vp-motion--glow'
} as const

/** Motions that need a non-inline transform box (Typography etc.). */
export const MOTION_TRANSFORM_KINDS: ReadonlySet<MotionKind> = new Set([
  'spin',
  'bounce',
  'heartbeat',
  'marqueeLeft',
  'marqueeRight',
  'scrollUp',
  'scrollDown',
  'dampOut'
])

export type MotionFlagKey = Exclude<keyof MotionProps, 'animationDuration'>

/** Resolve single active kind (same priority as useMotion). */
export function resolveMotionKind(
  flags: Partial<Record<MotionFlagKey, boolean | undefined>> & {
    forceSpin?: boolean
  }
): MotionKind | null {
  if (flags.forceSpin || flags.spin) return 'spin'
  if (flags.bounce) return 'bounce'
  if (flags.heartbeat) return 'heartbeat'
  if (flags.marqueeLeft) return 'marqueeLeft'
  if (flags.marqueeRight) return 'marqueeRight'
  if (flags.scrollUp) return 'scrollUp'
  if (flags.scrollDown) return 'scrollDown'
  if (flags.dampOut) return 'dampOut'
  if (flags.blink) return 'blink'
  if (flags.pulse) return 'pulse'
  if (flags.breathe) return 'breathe'
  if (flags.glow) return 'glow'
  return null
}

export function formatMotionDuration(value?: number | string): string | undefined {
  if (value == null) return undefined
  if (typeof value === 'number') return `${value}ms`
  return value
}
