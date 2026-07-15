import type { BaseProps, Size, Shape, MotionProps } from '@amg-webui/types'

export type AvatarSize = Size | number

export type AvatarShape = Shape

/** Host motion fields inlined so Vue `defineProps` emits runtime declarations. */
export interface AvatarProps extends BaseProps, MotionProps {
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
  /** Image URL */
  src?: string
  /** Accessible description for image / role=img */
  alt?: string
  /** Letter avatar text (username / initials) */
  text?: string
  /** Max graphemes for letter avatar (default 2) */
  textMaxLength?: number
  size?: AvatarSize
  shape?: AvatarShape
  /** Custom radius — CSS value (token / % preferred) */
  borderRadius?: string
  /** Lucide icon name — icon avatar / final fallback */
  icon?: string
  /** Show border (default true; neon variant always draws a dashed track) */
  bordered?: boolean
  /** Border color (token / CSS preferred) */
  borderColor?: string
  /** Border width CSS (default 1px hairline) */
  borderWidth?: string
  /**
   * Appearance: default | neon (dashed track + lightboard marquee glow).
   * Cascades from AvatarGroup when omitted.
   */
  variant?: 'default' | 'neon'
  /** Background override (token preferred) */
  colorBg?: string
  /** Text / icon color override */
  colorText?: string
  /** Hover tooltip content */
  tooltip?: string
  /** Tooltip show delay (ms) */
  tooltipDelay?: number
  disabled?: boolean
  /** Skeleton while image loads, or force skeleton */
  loading?: boolean
  /** Interactive — keyboard focus + click */
  clickable?: boolean
  /** Secondary image when `src` fails */
  fallbackSrc?: string
  /** Letter fallback when image fails (defaults to `text`) */
  fallbackText?: string
  /** Icon fallback when no letter text (default User) */
  fallbackIcon?: string
}

export interface AvatarEmits {
  (e: 'error', event: Event): void
  (e: 'click', event: MouseEvent): void
  (e: 'load', event: Event): void
}

export interface AvatarSlots {
  default?(props: Record<string, never>): unknown
  icon?(props: Record<string, never>): unknown
}
