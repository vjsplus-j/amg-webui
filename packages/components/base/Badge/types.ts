import type { BaseProps, Position, Severity, Size } from '@amg-webui/types'

export type BadgeSize = Size

export type BadgeSeverity = Severity

export type BadgePosition = Position

/**
 * Badge mark props.
 * `pulse` = badge-specific ring/brightness reminder (not shared opacity pulse).
 * Shared host motion: `spin` / `heartbeat` / `bounce` / `blink` / `breathe` / `glow`
 * (+ `animationDuration`). Badge `pulse` stays the ring reminder.
 * Motion fields inlined so Vue `defineProps` emits runtime declarations
 * (`Omit<MotionProps,'pulse'>` alone is not expanded by the SFC compiler).
 */
export interface BadgeProps extends BaseProps {
  /** Continuous rotate — shared Motion */
  spin?: boolean
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
  /** Count or short text mark (NEW / HOT…). Number ≤0 hides unless `dot`. */
  value?: string | number
  /** Truncate threshold — shows `{max}+` when numeric value exceeds (default 99). */
  max?: number
  /** Pure status dot — no number / text. */
  dot?: boolean
  /** Force hide. */
  hidden?: boolean
  /** Alias of `severity` */
  type?: BadgeSeverity
  severity?: BadgeSeverity
  size?: BadgeSize
  /** Anchor corner relative to host (default top-right). */
  position?: BadgePosition
  /**
   * Extra translate offset `[x, y]` in px (right/down positive when top-right).
   * Prefer leaving at `[0,0]` so Token offsets control alignment.
   */
  offset?: [number, number]
  /** Custom background (prefer CSS Token vars). */
  colorBg?: string
  /** Custom text color (prefer CSS Token vars). */
  colorText?: string
  /** Shorthand fill — sets background; pair with `colorText` for contrast. */
  color?: string
  /** Hover tooltip content. */
  tooltip?: string
  /** Tooltip show delay (ms). */
  tooltipDelay?: number
  /** Dimmed / expired mark. */
  disabled?: boolean
  /** Badge ring/brightness pulse for urgent reminders (not shared `vp-motion--pulse`). */
  pulse?: boolean
  /** Override accessible name; defaults to count / text / i18n for dots. */
  ariaLabel?: string
  /** Pure decoration — suppress screen-reader announcement. */
  decorative?: boolean
}

export interface BadgeEmits {
  (e: 'click', event: MouseEvent): void
}

export interface BadgeSlots {
  default?(props: Record<string, never>): unknown
}
