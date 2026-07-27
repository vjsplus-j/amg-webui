import type { Size, BaseProps, MotionProps } from '@amg-webui/types'

/** Lucide icon names (PascalCase). Aliases like Trash → Trash2 are supported. */
export type IconName = string

export type IconSize = Size | number | string

export type IconFlip = 'horizontal' | 'vertical' | 'both'

/** Host motion fields inlined so Vue `defineProps` emits runtime declarations
 * (`extends MotionProps` alone is not always expanded by the SFC compiler). */
export interface IconProps extends BaseProps, MotionProps {
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
  /** Lucide icon name (PascalCase or kebab-case aliases) */
  name?: IconName
  /** Token size xs–xl, or custom number (px) / CSS length */
  size?: IconSize
  /** Fill/stroke color; defaults to currentColor / inherit */
  color?: string
  /** Override Lucide stroke width; defaults from IconStyleService / --icon-stroke-width */
  strokeWidth?: number
  /**
   * When true, stroke width stays constant in screen px as the icon scales
   * (Lucide `absoluteStrokeWidth`).
   */
  absoluteStrokeWidth?: boolean
  /** Static rotation in degrees */
  rotate?: number
  /** Flip glyph horizontally and/or vertically */
  flip?: IconFlip
  /** Horizontal flip (shorthand) */
  flipH?: boolean
  /** Vertical flip (shorthand) */
  flipV?: boolean
  /** Dimmed, non-interactive appearance */
  disabled?: boolean
  /** Replace glyph with Loader2 + spin until cleared */
  loading?: boolean
  /** Selected accent color */
  selected?: boolean
  /** Opacity 0–1 (also via style) */
  opacity?: number
  /**
   * Accessible name. When set, role="img" + aria-label; otherwise aria-hidden.
   * Checklist `alt` is accepted as an alias.
   */
  label?: string
  /** Alias of `label` (a11y / alt text) */
  alt?: string
  /** Native title tooltip */
  title?: string
  /**
   * Treat as a control: role=button, focusable, Enter/Space activate.
   * Also auto-enabled when the parent listens for `@click`.
   * Presentational by default — no Telemetry (see TELEMETRY.md).
   */
  interactive?: boolean
}

export interface IconEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'keydown', event: KeyboardEvent): void
}
