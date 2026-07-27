import { computed, inject, type ComputedRef } from 'vue'
import type { Size } from '@amg-webui/types'
import { useMotion } from '@amg-webui/hooks'
import type { ButtonProps, ButtonShape, ButtonSeverity, ButtonVariant } from './types'
import { BUTTON_CONFIG_KEY, BUTTON_GROUP_KEY } from './config'

export interface UseButtonOptions {
  /** No label and no default slot — icon / img only */
  iconOnly?: ComputedRef<boolean> | boolean
}

const SIZE_CLASS: Record<string, [string, string]> = {
  xs: ['vp-button--xs', 'p-button-xs'],
  sm: ['vp-button--sm', 'p-button-sm'],
  md: ['vp-button--md', 'p-button-md'],
  lg: ['vp-button--lg', 'p-button-lg'],
  xl: ['vp-button--xl', 'p-button-xl']
}

const VARIANT_MAP: Record<string, string> = {
  solid: 'solid',
  outlined: 'outlined',
  outline: 'outlined',
  dashed: 'dashed',
  neon: 'neon',
  text: 'text',
  light: 'text'
}

const SPACING_TOKEN: Record<Size, string> = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)'
}

function resolveIconOnly(
  iconOnly: UseButtonOptions['iconOnly']
): boolean {
  if (typeof iconOnly === 'object' && iconOnly !== null && 'value' in iconOnly) {
    return Boolean(iconOnly.value)
  }
  return Boolean(iconOnly)
}

export function useButton(props: ButtonProps, options: UseButtonOptions = {}) {
  const globalConfig = inject(BUTTON_CONFIG_KEY, {})
  const group = inject(BUTTON_GROUP_KEY, null)

  const resolvedSize = computed(
    () => props.size ?? group?.size ?? globalConfig.size ?? 'md'
  )

  const resolvedSeverity = computed((): ButtonSeverity => {
    if (props.link) return 'link'
    return (
      props.severity ??
      group?.severity ??
      globalConfig.severity ??
      'default'
    )
  })

  const resolvedVariant = computed((): string => {
    const raw = (props.variant ?? group?.variant ?? 'solid') as ButtonVariant | string
    return VARIANT_MAP[raw] || 'solid'
  })

  const hasPermission = computed(() => {
    const p = props.permission
    // Treat nullish as allowed (defensive — withDefaults uses `permission: true`).
    if (p == null) return true
    if (typeof p === 'function') return Boolean(p())
    return Boolean(p)
  })

  const permissionDenied = computed(() => !hasPermission.value)

  const hideByPermission = computed(
    () => permissionDenied.value && (props.permissionMode ?? 'hide') === 'hide'
  )

  const disableByPermission = computed(
    () => permissionDenied.value && (props.permissionMode ?? 'hide') === 'disable'
  )

  const isLinkMorph = computed(
    () => resolvedSeverity.value === 'link' || Boolean(props.link)
  )

  const isBlock = computed(() => Boolean(props.block || props.fluid))

  const isGroupLoading = computed(() => Boolean(group?.loading))

  const isLoading = computed(() => Boolean(props.loading || isGroupLoading.value))

  const isDisabled = computed(
    () =>
      Boolean(
        props.disabled ||
          group?.disabled ||
          isLoading.value ||
          disableByPermission.value
      )
  )

  const isReadonly = computed(() => Boolean(props.readonly) && !isDisabled.value)

  const isInteractiveLocked = computed(
    () => isDisabled.value || isReadonly.value || isLoading.value
  )

  const showStar = computed(() => Boolean(props.star || props.rated))

  const badgeText = computed(() => {
    if (props.badge == null || props.badge === '') return ''
    return String(props.badge)
  })

  const resolvedWait = computed(
    () => props.wait ?? globalConfig.wait ?? 300
  )

  const resolvedGuard = computed(
    () => props.clickGuard ?? globalConfig.clickGuard ?? 'none'
  )

  const resolvedRipple = computed(
    () => props.ripple ?? globalConfig.ripple ?? false
  )

  const resolvedBorderRadius = computed(
    () => props.borderRadius ?? globalConfig.borderRadius
  )

  const iconGapStyle = computed(() => {
    if (!props.iconGap) return undefined
    if (props.iconGap in SPACING_TOKEN) {
      return SPACING_TOKEN[props.iconGap as Size]
    }
    return String(props.iconGap)
  })

  const { motionClass, motionStyle } = useMotion(() => ({
    spin: props.spin,
    pulse: props.pulse,
    heartbeat: props.heartbeat,
    bounce: props.bounce,
    blink: props.blink,
    breathe: props.breathe,
    glow: props.glow,
    marqueeLeft: props.marqueeLeft,
    marqueeRight: props.marqueeRight,
    scrollUp: props.scrollUp,
    scrollDown: props.scrollDown,
    dampOut: props.dampOut,
    animationDuration: props.animationDuration
  }))

  const buttonStyle = computed(() => {
    const style: Record<string, string> = {
      ...(props.style || {}),
      ...motionStyle.value
    }
    if (resolvedBorderRadius.value) {
      style.borderRadius = resolvedBorderRadius.value
    }
    if (iconGapStyle.value) {
      style['--vp-btn-gap'] = iconGapStyle.value
    }
    if (props.colorBg) style['--vp-btn-custom-bg'] = props.colorBg
    if (props.colorText) style['--vp-btn-custom-fg'] = props.colorText
    if (props.colorBorder) style['--vp-btn-custom-border'] = props.colorBorder
    if (props.colorHoverBg) style['--vp-btn-custom-hover-bg'] = props.colorHoverBg
    return style
  })

  const buttonClass = computed(() => {
    const classes = ['vp-button', 'p-button']
    const size = resolvedSize.value
    classes.push(...(SIZE_CLASS[size] || SIZE_CLASS.md))

    const variant = resolvedVariant.value
    classes.push(`vp-button--${variant}`, `p-button-${variant}`)

    let severity = resolvedSeverity.value
    if (severity === 'default') severity = 'secondary'
    if (severity === 'link') {
      classes.push('vp-button--link', 'p-button-link')
    } else {
      classes.push(`vp-button--${severity}`, `p-button-${severity}`)
    }

    if (isLinkMorph.value) {
      classes.push('vp-button--link', 'p-button-link')
    }

    const shape: ButtonShape = props.shape || 'rect'
    classes.push(`vp-button--${shape}`)
    if (shape !== 'rect') classes.push(`p-button-${shape}`)

    if (resolveIconOnly(options.iconOnly)) {
      classes.push('vp-button--icon-only', 'p-button-icon-only')
    }

    if (props.iconPos === 'top') {
      classes.push('vp-button--icon-top')
    }

    if (props.rounded || shape === 'circle') {
      classes.push('vp-button--rounded', 'p-button-rounded')
    }

    if (props.raised) {
      classes.push('vp-button--raised', 'p-button-raised')
    }

    if (isBlock.value) {
      classes.push('vp-button--block', 'p-button-block')
    }

    if (isLoading.value) {
      classes.push('vp-button--loading', 'p-button-loading')
    }

    if (isReadonly.value) {
      classes.push('vp-button--readonly')
    }

    if (disableByPermission.value) {
      classes.push('vp-button--no-permission')
    }

    if (props.star || props.rated) {
      classes.push('vp-button--star')
    }

    if (props.badge != null && props.badge !== '') {
      classes.push('vp-button--badge')
    }

    if (props.img) {
      classes.push('vp-button--img')
    }

    if (
      props.colorBg ||
      props.colorText ||
      props.colorBorder ||
      props.colorHoverBg
    ) {
      classes.push('vp-button--custom-color')
    }

    if (group) {
      classes.push('vp-button--in-group')
    }

    classes.push(...motionClass.value)

    if (props.class) {
      classes.push(props.class)
    }

    return classes.join(' ')
  })

  return {
    buttonClass,
    buttonStyle,
    isDisabled,
    isReadonly,
    isInteractiveLocked,
    isLoading,
    hideByPermission,
    disableByPermission,
    permissionDenied,
    hasPermission,
    showStar,
    badgeText,
    resolvedSize,
    resolvedWait,
    resolvedGuard,
    resolvedRipple,
    isBlock,
    isLinkMorph
  }
}
