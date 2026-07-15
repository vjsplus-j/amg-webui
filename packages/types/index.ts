export type Severity = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'

export type Variant = 'solid' | 'outlined' | 'outline' | 'dashed' | 'neon' | 'text' | 'light'

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export type Shape = 'circle' | 'square'

export interface BaseProps {
  class?: string
  style?: Record<string, string>
  /** Business track id for Vp Telemetry habit analysis */
  trackId?: string
  /**
   * Per-instance telemetry override.
   * `false` forces skip even when TelemetryService is enabled.
   * Components must default this to `undefined` in withDefaults —
   * Vue casts omitted Boolean props to `false`, which would skip all tracks.
   */
  telemetry?: boolean
}

export interface LabelProps {
  label?: string
}

export interface DisabledProps {
  disabled?: boolean
}

export interface ReadonlyProps {
  readonly?: boolean
}

export interface InvalidProps {
  invalid?: boolean
}

export interface IconProps {
  icon?: string
}

export interface LoadingProps {
  loading?: boolean
}

/** Shared host keyframe motion kinds (see `@amg-webui/animations/motion.scss` + `useMotion`). */
export type MotionKind =
  | 'spin'
  | 'bounce'
  | 'heartbeat'
  | 'marqueeLeft'
  | 'marqueeRight'
  | 'scrollUp'
  | 'scrollDown'
  | 'dampOut'
  | 'blink'
  | 'pulse'
  | 'breathe'
  | 'glow'

/**
 * Library-wide host motion props — Icon / Avatar / Badge / Button / Tag / Typography …
 * Priority when multiple flags are set:
 * spin > bounce > heartbeat > marqueeLeft > marqueeRight > scrollUp > scrollDown >
 * dampOut > blink > pulse > breathe > glow.
 */
export interface MotionProps {
  /** Continuous rotate */
  spin?: boolean
  /** Soft opacity pulse */
  pulse?: boolean
  /** Scale heartbeat */
  heartbeat?: boolean
  /** Jump upward in place */
  bounce?: boolean
  /** Sharp on/off flash (strobe) */
  blink?: boolean
  /** Breathing light — opacity + soft glow */
  breathe?: boolean
  /** Fluorescent / neon text-shadow glow */
  glow?: boolean
  /** Marquee scroll to the left */
  marqueeLeft?: boolean
  /** Marquee scroll to the right */
  marqueeRight?: boolean
  /** Vertical scroll upward */
  scrollUp?: boolean
  /** Vertical scroll downward */
  scrollDown?: boolean
  /** Damped zoom in → settle → shrink & fade out (one-shot) */
  dampOut?: boolean
  /** Duration: number (ms) or CSS time string */
  animationDuration?: number | string
}

export interface RoundedProps {
  rounded?: boolean
}

export interface RaisedProps {
  raised?: boolean
}

export interface FluidProps {
  fluid?: boolean
}

export interface ClickableProps {
  clickable?: boolean
}

export interface HoverProps {
  hover?: boolean
}

export interface SelectOption {
  label: string
  value: unknown
  disabled?: boolean
}

export interface ComponentEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

export interface InputEmits<T = string> {
  (e: 'update:modelValue', value: T): void
  (e: 'input', event: Event): void
  (e: 'change', event: Event): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

export interface VisibleEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'show', event?: Event): void
  (e: 'hide', event?: Event): void
  (e: 'close', event?: Event): void
}
