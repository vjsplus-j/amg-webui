import type { BaseProps, Severity, MotionProps } from '@amg-webui/types'

/** Heading · paragraph · auxiliary text levels */
export type TypographyType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'body-lg'
  | 'body-sm'
  | 'caption'
  | 'secondary'

export type TypographyFontFamily = 'sans' | 'display' | 'mono'

export interface TypographyEllipsisConfig {
  /** Clamp lines; 1 = single-line ellipsis */
  rows?: number
  /** Show full text via native title when overflowing */
  tooltip?: boolean
}

export type TypographyEllipsis = boolean | TypographyEllipsisConfig

export interface TypographyCopyableConfig {
  /** Override clipboard payload (async/dynamic-friendly) */
  text?: string
  /** Hide the copy icon button (keyboard copy still available when focused) */
  icon?: boolean
}

export type TypographyCopyable = boolean | TypographyCopyableConfig

export interface TypographyProps extends BaseProps, MotionProps {
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
  type?: TypographyType
  /** Semantic status color */
  typeColor?: Severity
  /** Alias of typeColor */
  color?: Severity
  copyable?: TypographyCopyable
  ellipsis?: TypographyEllipsis
  strong?: boolean
  italic?: boolean
  underline?: boolean
  /** Strikethrough */
  delete?: boolean
  mark?: boolean
  code?: boolean
  disabled?: boolean
  /**
   * Wait / thinking state — keeps the text visible while a light beam
   * walks across the glyphs (not a block skeleton).
   */
  loading?: boolean
  /** Same light-beam visual without locking interaction / aria-busy */
  shimmer?: boolean
  clickable?: boolean
  fontFamily?: TypographyFontFamily
  /** CSS length or unitless; prefers design tokens when string */
  lineHeight?: string | number
  /** Explicit text when default slot is empty / for copy payload fallback */
  content?: string
}

export interface TypographyEmits {
  (e: 'copy', text: string): void
  (e: 'copyError', error: Error): void
  (e: 'click', event: MouseEvent): void
}
