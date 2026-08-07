import { computed } from 'vue'
import type { SpacerAxis, SpacerProps, SpacerSize } from './types'

const sizeVar: Record<SpacerSize, string> = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
  section: 'var(--theme-section-gap)'
}

function applyAxisSize(style: Record<string, string>, axis: SpacerAxis, value: string) {
  if (axis === 'vertical' || axis === 'both') style.height = value
  if (axis === 'horizontal' || axis === 'both') style.width = value
  if (axis === 'both') {
    style.minWidth = value
    style.minHeight = value
  }
}

export function useSpacerStyle(props: SpacerProps) {
  const isFlex = computed(() => props.flex && props.size == null)

  const rootClass = computed(() => [
    'vp-spacer',
    `vp-spacer--${props.axis ?? 'horizontal'}`,
    {
      'vp-spacer--flex': isFlex.value,
      'vp-spacer--inline': props.inline,
      [`vp-spacer--size-${props.size}`]: props.size != null
    },
    props.class
  ])

  const rootStyle = computed(() => {
    const next: Record<string, string> = { ...(props.style ?? {}) }
    const axis = props.axis ?? 'horizontal'
    if (isFlex.value) {
      const grow = Math.max(0, Number(props.grow) || 1)
      const shrink = Math.max(0, Number(props.shrink) || 1)
      next.flexGrow = String(grow)
      next.flexShrink = String(shrink)
      next.flexBasis = props.basis ?? 'auto'
      if (props.minSize) applyAxisSize(next, axis, sizeVar[props.minSize])
    }
    if (props.size) applyAxisSize(next, axis, sizeVar[props.size])
    return next
  })

  return {
    isFlex,
    rootClass,
    rootStyle
  }
}
