import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { IconFlip, IconSize } from './types'
import type { IconStyleName } from '@amg-webui/theme'

const TOKEN_SIZES = new Set(['xs', 'sm', 'md', 'lg', 'xl'])

export interface UseIconSource {
  size?: IconSize
  name?: string
  loading?: boolean
  disabled?: boolean
  interactive?: boolean
  label?: string
  alt?: string
  title?: string
  rotate?: number
  flip?: IconFlip
  flipH?: boolean
  flipV?: boolean
  strokeWidth?: number
  iconStyle?: IconStyleName
  /** True when parent listens for `@click` (auto-interactive) */
  hasClickListener?: boolean
}

/**
 * Resolve Icon size tokens, Lucide stroke, transforms, and a11y attrs.
 */
export function useIcon(source: MaybeRefOrGetter<UseIconSource>) {
  const sizeClassList = computed(() => {
    const size = toValue(source).size
    if (typeof size === 'string' && TOKEN_SIZES.has(size)) {
      return [`vp-icon--${size}`, `p-icon-${size}`]
    }
    return [] as string[]
  })

  const lucideSize = computed(() => {
    const size = toValue(source).size
    if (typeof size === 'number') return size
    if (typeof size === 'string' && /^\d+(\.\d+)?$/.test(size)) return Number(size)
    return undefined
  })

  const customSizeStyle = computed(() => {
    const size = toValue(source).size
    const out: Record<string, string> = {}
    if (typeof size === 'number') {
      out.width = `${size}px`
      out.height = `${size}px`
      return out
    }
    if (typeof size === 'string' && /^\d+(\.\d+)?$/.test(size)) {
      out.width = `${size}px`
      out.height = `${size}px`
      return out
    }
    if (typeof size === 'string' && !TOKEN_SIZES.has(size)) {
      out.width = size
      out.height = size
    }
    return out
  })

  const strokeWidth = computed(() => {
    const s = toValue(source)
    if (s.strokeWidth != null) return s.strokeWidth
    return s.iconStyle === 'solid' ? 2.25 : 1.75
  })

  const a11yLabel = computed(() => {
    const s = toValue(source)
    return s.label || s.alt || undefined
  })

  const resolvedFlipH = computed(() => {
    const s = toValue(source)
    return Boolean(s.flipH || s.flip === 'horizontal' || s.flip === 'both')
  })

  const resolvedFlipV = computed(() => {
    const s = toValue(source)
    return Boolean(s.flipV || s.flip === 'vertical' || s.flip === 'both')
  })

  const transformValue = computed(() => {
    const s = toValue(source)
    const parts: string[] = []
    const deg = Number(s.rotate)
    if (Number.isFinite(deg) && deg !== 0) parts.push(`rotate(${deg}deg)`)
    if (resolvedFlipH.value) parts.push('scaleX(-1)')
    if (resolvedFlipV.value) parts.push('scaleY(-1)')
    return parts.length ? parts.join(' ') : undefined
  })

  const resolvedName = computed(() => {
    const s = toValue(source)
    if (s.loading) return 'Loader2'
    return s.name
  })

  const isInteractive = computed(() => {
    const s = toValue(source)
    if (s.disabled) return false
    if (s.interactive) return true
    return Boolean(s.hasClickListener)
  })

  const isActionLocked = computed(() => {
    const s = toValue(source)
    return Boolean(s.disabled || s.loading)
  })

  /**
   * Host a11y:
   * - decorative (default): aria-hidden
   * - labeled: role=img + aria-label
   * - interactive: role=button + keyboard focus
   */
  const a11yAttrs = computed(() => {
    const s = toValue(source)
    const label = a11yLabel.value
    const interactive = isInteractive.value

    if (interactive) {
      return {
        role: 'button' as const,
        tabindex: isActionLocked.value ? -1 : 0,
        'aria-label': label || s.title || s.name || undefined,
        'aria-hidden': undefined as undefined,
        'aria-disabled': s.disabled ? true : undefined,
        'aria-busy': s.loading ? true : undefined
      }
    }

    if (label) {
      return {
        role: 'img' as const,
        tabindex: undefined as undefined,
        'aria-label': label,
        'aria-hidden': undefined as undefined,
        'aria-disabled': s.disabled ? true : undefined,
        'aria-busy': s.loading ? true : undefined
      }
    }

    return {
      role: undefined as undefined,
      tabindex: undefined as undefined,
      'aria-label': undefined as undefined,
      'aria-hidden': true as const,
      'aria-disabled': undefined as undefined,
      'aria-busy': s.loading ? true : undefined
    }
  })

  return {
    sizeClassList,
    lucideSize,
    customSizeStyle,
    strokeWidth,
    a11yLabel,
    resolvedFlipH,
    resolvedFlipV,
    transformValue,
    resolvedName,
    isInteractive,
    isActionLocked,
    a11yAttrs
  }
}
