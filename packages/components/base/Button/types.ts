import type { Severity, Variant, Size, BaseProps, MotionProps } from '@amg-webui/types'

/** Checklist types: default / primary / success / warning / danger / link (+ library extras). */
export type ButtonSeverity =
  | 'default'
  | Severity
  | 'help'
  | 'contrast'
  | 'link'

export type ButtonIconPos = 'left' | 'right' | 'top'

/** 矩形 / 方形 / 圆形 — 默认 rect */
export type ButtonShape = 'rect' | 'square' | 'circle'

/** solid | outline(d) | dashed | neon (荧光虚线) | text */
export type ButtonVariant = Variant

export type ButtonClickGuard = 'none' | 'debounce' | 'throttle'

export type ButtonPermissionMode = 'hide' | 'disable'

export type ButtonNativeType = 'button' | 'submit' | 'reset'

export interface ButtonProps extends BaseProps, MotionProps {
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
  /** Lucide icon name (e.g. `Star`) — used when `#icon` slot is empty */
  icon?: string
  iconPos?: ButtonIconPos
  /** Override icon size token (defaults to button size) */
  iconSize?: Size
  /** Gap between icon and label — Size token or CSS length */
  iconGap?: Size | string
  severity?: ButtonSeverity
  variant?: ButtonVariant
  /** 极小 xs → 超大 xl，映射 `--height-*` */
  size?: Size
  /** 形状：矩形（默认）/ 方形 / 圆形 */
  shape?: ButtonShape
  /** Pill / full radius */
  rounded?: boolean
  /** Custom radius — CSS value (prefer token / `%`) */
  borderRadius?: string
  raised?: boolean
  /** Alias for severity=`link` / link morph */
  link?: boolean
  /** Block-level: width 100% */
  block?: boolean
  /** Alias of block (FluidProps parity) */
  fluid?: boolean
  loading?: boolean
  /** Shown next to loader when loading */
  loadingText?: string
  disabled?: boolean
  /** Native title when disabled (hover tip) */
  disabledTitle?: string
  /** Visual normal, clicks ignored (≠ disabled) */
  readonly?: boolean
  type?: ButtonNativeType
  /** 角标 / 微章内容（绝对定位，不撑布局） */
  badge?: string | number
  /** 标星指示 */
  star?: boolean
  /** 标星别名 */
  rated?: boolean
  /** 图片按钮（avatar 风格） */
  img?: string
  /** icon-only / img 时的无障碍标签 */
  ariaLabel?: string
  /** Native tooltip text */
  title?: string
  /** State semantics for disclosure/toggle buttons */
  ariaExpanded?: boolean
  ariaPressed?: boolean
  /**
   * Permission gate. `true` / missing = allowed.
   * `false` or failing checker → hide or disable per `permissionMode`.
   */
  permission?: boolean | (() => boolean)
  permissionMode?: ButtonPermissionMode
  /** Tip when permission denied (disable mode / click tip) */
  permissionTip?: string
  /** Enable built-in confirm before click emit */
  confirm?: boolean | string
  confirmTitle?: string
  /** Pre-click interceptor — return false / reject to abort */
  beforeClick?: (event: MouseEvent) => boolean | void | Promise<boolean | void>
  /** Debounce / throttle / none */
  clickGuard?: ButtonClickGuard
  /** Wait ms for debounce / throttle (falls back to global config) */
  wait?: number
  /** Safe external / internal href — renders as `<a>` when set */
  href?: string
  /** Route path string (uses vue-router `$router` when available) */
  to?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  replace?: boolean
  /** Ripple click feedback */
  ripple?: boolean
  /** Optional CSS color overrides (pass token vars, never raw hex in library demos) */
  colorBg?: string
  colorText?: string
  colorBorder?: string
  colorHoverBg?: string
}

export interface ButtonEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'confirm', event: Event): void
  (e: 'cancelConfirm', event: Event): void
}
