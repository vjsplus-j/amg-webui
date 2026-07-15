import type { BaseProps, Severity, Size, MotionProps } from '@amg-webui/types'

/** solid = 纯色 · outlined = 边框 · light = 状态浅底 · neon = 荧光虚线灯牌 */
export type TagEffect = 'solid' | 'outlined' | 'light' | 'neon'

/** Spec: default / primary / success / warning / danger (+ library Severity extras) */
export type TagSeverity = 'default' | Severity

export type TagSize = Size

export interface TagProps extends BaseProps, MotionProps {
  /** Continuous rotate — shared Motion */
  spin?: boolean
  /** Soft opacity pulse — shared Motion */
  pulse?: boolean
  /** Scale heartbeat — shared Motion */
  heartbeat?: boolean
  /** Jump upward — shared Motion */
  bounce?: boolean
  /** Sharp flash — shared Motion */
  blink?: boolean
  /** Breathing light — shared Motion */
  breathe?: boolean
  /** Fluorescent glow — shared Motion */
  glow?: boolean
  /** Marquee scroll left — shared Motion */
  marqueeLeft?: boolean
  /** Marquee scroll right — shared Motion */
  marqueeRight?: boolean
  /** Vertical scroll up — shared Motion */
  scrollUp?: boolean
  /** Vertical scroll down — shared Motion */
  scrollDown?: boolean
  /** Damped zoom then fade out — shared Motion */
  dampOut?: boolean
  /** Animation duration (ms or CSS time) — shared Motion */
  animationDuration?: number | string
  label?: string
  /** Alias of `severity` */
  type?: TagSeverity
  severity?: TagSeverity
  effect?: TagEffect
  size?: TagSize
  /** Lucide icon name — prefix; size follows tag unless `iconSize` set */
  icon?: string
  iconSize?: Size
  closable?: boolean
  /** Pill / full radius */
  round?: boolean
  /** Alias of `round` */
  rounded?: boolean
  /** Custom radius — CSS value (token / % preferred) */
  borderRadius?: string
  disabled?: boolean
  /** Interactive tag — keyboard focus + role=button when click listeners present */
  clickable?: boolean
  /** Close debounce wait (ms); falls back to global config */
  wait?: number
  /** Pre-close interceptor — return false / reject to abort */
  beforeClose?: (event: MouseEvent) => boolean | void | Promise<boolean | void>
  /** Custom fill (prefer CSS vars / tokens) */
  colorBg?: string
  /** Custom text color */
  colorText?: string
  /** Custom border color */
  colorBorder?: string
  /**
   * Shorthand custom color: solid → bg; outlined/light → text + border.
   * Prefer Token vars; pair with colorText for contrast when needed.
   */
  color?: string
}

export interface TagEmits {
  (e: 'close', event: MouseEvent): void
  (e: 'click', event: MouseEvent): void
}

export interface TagSlots {
  default?(props: Record<string, never>): unknown
  icon?(props: Record<string, never>): unknown
  closeIcon?(props: Record<string, never>): unknown
}
