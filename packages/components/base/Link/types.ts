import type { BaseProps, Size, Severity } from '@amg-webui/types'

/** Spec types + Severity extras for Button/system parity. */
export type LinkType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'link' | Severity

export type LinkUnderline = boolean | 'hover' | 'always' | 'never'

export type LinkIconPos = 'left' | 'right'

export type LinkClickGuard = 'none' | 'debounce' | 'throttle'

export type LinkPermissionMode = 'hide' | 'disable'

export interface LinkProps extends BaseProps {
  /** External URL — blocked for javascript:/data:/vbscript: */
  href?: string
  /** Internal path (vue-router `$router` when available) */
  to?: string
  /** Semantic color; `link` = native hyperlink primary */
  type?: LinkType
  /** xs → xl, maps font-size tokens (aligned with Button) */
  size?: Size
  /** Underline mode; `true`≡always, `false`≡never */
  underline?: LinkUnderline
  disabled?: boolean
  /** Visual normal, clicks/navigation ignored (≠ disabled) */
  readonly?: boolean
  /** Locks interaction; shows spinner (overrides custom icon) */
  loading?: boolean
  target?: '_self' | '_blank' | '_parent' | '_top' | string
  replace?: boolean
  /** Lucide icon name */
  icon?: string
  iconPos?: LinkIconPos
  /** Override icon size token (defaults to link size) */
  iconSize?: Size
  /** Gap between icon and text — Size token or CSS length */
  iconGap?: Size | string
  /** Accessible name when slot text is insufficient */
  ariaLabel?: string
  /** Native title / tooltip hint */
  tooltip?: string
  /** Stop click bubbling (tables / nested actions) */
  stopPropagation?: boolean
  /**
   * Permission gate. `true` / missing = allowed.
   * Vue Boolean props omit as `false` — component default must be `true`
   * so hide mode does not blank every Link.
   * `false` or failing checker → hide or disable per `permissionMode`.
   */
  permission?: boolean | (() => boolean)
  permissionMode?: LinkPermissionMode
  permissionTip?: string
  /** Pre-click interceptor — return false / reject to abort */
  beforeClick?: (event: MouseEvent) => boolean | void | Promise<boolean | void>
  clickGuard?: LinkClickGuard
  /** Wait ms for debounce / throttle */
  wait?: number
}

export interface LinkEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}
