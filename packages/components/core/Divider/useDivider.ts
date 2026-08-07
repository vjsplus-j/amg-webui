import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { DividerDirection, DividerMargin } from './types'

export interface UseDividerSource {
  direction?: DividerDirection
  type?: DividerDirection
  margin?: DividerMargin
  dashed?: boolean
  plain?: boolean
  decorative?: boolean
  ariaLabel?: string
  hasText?: boolean
}

/**
 * Resolve Divider axis + a11y attrs (shared by host SFC).
 */
export function useDivider(source: MaybeRefOrGetter<UseDividerSource>) {
  const axis = computed<DividerDirection>(() => {
    const s = toValue(source)
    return s.direction ?? s.type ?? 'horizontal'
  })

  const a11yAttrs = computed(() => {
    const s = toValue(source)
    if (s.decorative) {
      return {
        role: undefined as undefined,
        'aria-orientation': undefined as undefined,
        'aria-label': undefined as undefined,
        'aria-hidden': true as const
      }
    }
    return {
      role: 'separator' as const,
      'aria-orientation': axis.value as 'horizontal' | 'vertical',
      'aria-label': s.ariaLabel || undefined,
      'aria-hidden': undefined as undefined
    }
  })

  return { axis, a11yAttrs }
}
