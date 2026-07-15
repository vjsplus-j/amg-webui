import { computed } from 'vue'
import type { Size } from '@amg-webui/types'
import type { LinkProps } from './types'

const DANGEROUS_PROTOCOL = /^(javascript|data|vbscript):/i

const SPACING_TOKEN: Record<Size, string> = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)'
}

export function isSafeHref(href: string | undefined): boolean {
  if (!href) return false
  return !DANGEROUS_PROTOCOL.test(href.trim())
}

export function useLink(props: LinkProps) {
  const resolvedSize = computed<Size>(() => props.size ?? 'md')

  const hasPermission = computed(() => {
    // Default allow: undefined / true / passing checker.
    // Explicit false (or failing checker) denies — see Link default `permission: true`.
    if (props.permission === undefined || props.permission === true) return true
    if (typeof props.permission === 'function') return Boolean(props.permission())
    return Boolean(props.permission)
  })

  const permissionDenied = computed(() => !hasPermission.value)

  const hideByPermission = computed(
    () => permissionDenied.value && (props.permissionMode ?? 'hide') === 'hide'
  )

  const disableByPermission = computed(
    () => permissionDenied.value && (props.permissionMode ?? 'hide') === 'disable'
  )

  const isDisabled = computed(() =>
    Boolean(props.disabled || props.loading || disableByPermission.value)
  )

  const isReadonly = computed(() => Boolean(props.readonly) && !isDisabled.value)

  const isInteractiveLocked = computed(
    () => isDisabled.value || isReadonly.value || Boolean(props.loading)
  )

  const safeHref = computed(() => {
    if (props.href && isSafeHref(props.href)) return props.href
    if (props.to) return props.to
    return undefined
  })

  /** Render as `<a>` only when navigable and not locked. */
  const isAnchor = computed(
    () => Boolean(safeHref.value) && !isInteractiveLocked.value
  )

  const iconTokenSize = computed<Size>(() => props.iconSize ?? resolvedSize.value)

  const underlineKey = computed(() => {
    const underline = props.underline ?? 'hover'
    if (underline === true || underline === 'always') return 'always'
    if (underline === false || underline === 'never') return 'never'
    return 'hover'
  })

  const linkStyle = computed(() => {
    const style: Record<string, string> = { ...(props.style || {}) }
    if (props.iconGap) {
      if (props.iconGap in SPACING_TOKEN) {
        style['--vp-link-gap'] = SPACING_TOKEN[props.iconGap as Size]
      } else {
        style['--vp-link-gap'] = String(props.iconGap)
      }
    }
    return style
  })

  const linkClass = computed(() => {
    const type = props.type ?? 'default'
    return [
      'vp-link',
      `vp-link--${type}`,
      `vp-link--${resolvedSize.value}`,
      `vp-link--underline-${underlineKey.value}`,
      {
        'vp-link--disabled': isDisabled.value,
        'vp-link--readonly': isReadonly.value,
        'vp-link--loading': Boolean(props.loading),
        'vp-link--has-icon': Boolean(props.icon || props.loading),
        'vp-link--icon-right': props.iconPos === 'right',
        'vp-link--no-permission': disableByPermission.value
      },
      props.class
    ]
  })

  const resolvedWait = computed(() => props.wait ?? 300)

  const resolvedGuard = computed(() => props.clickGuard ?? 'none')

  const nativeTitle = computed(() => {
    if (disableByPermission.value && props.permissionTip) return props.permissionTip
    return props.tooltip
  })

  return {
    safeHref,
    isAnchor,
    linkClass,
    linkStyle,
    resolvedSize,
    iconTokenSize,
    hideByPermission,
    disableByPermission,
    permissionDenied,
    isDisabled,
    isReadonly,
    isInteractiveLocked,
    resolvedWait,
    resolvedGuard,
    nativeTitle
  }
}
