<script setup lang="ts">
import { computed } from 'vue'
import type { SpacerAxis, SpacerSize } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    flex?: boolean
    grow?: number
    shrink?: number
    size?: SpacerSize
    axis?: SpacerAxis
    minSize?: SpacerSize
    class?: string
    style?: Record<string, string>
  }>(),
  {
    flex: true,
    grow: 1,
    shrink: 1,
    axis: 'horizontal'
  }
)

const sizeVar: Record<SpacerSize, string> = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
  section: 'var(--theme-section-gap)'
}

const isFlex = computed(() => props.flex && props.size == null)

const rootClass = computed(() => [
  'vp-spacer',
  `vp-spacer--${props.axis}`,
  {
    'vp-spacer--flex': isFlex.value,
    [`vp-spacer--size-${props.size}`]: props.size != null
  },
  props.class
])

const rootStyle = computed(() => {
  const s: Record<string, string> = { ...(props.style ?? {}) }
  if (isFlex.value) {
    const g = Math.max(0, Number(props.grow) || 1)
    const sh = Math.max(0, Number(props.shrink) ?? 1)
    s.flexGrow = String(g)
    s.flexShrink = String(sh)
    s.flexBasis = 'auto'
    if (props.minSize) {
      const minV = sizeVar[props.minSize]
      if (props.axis === 'vertical' || props.axis === 'both') s.minHeight = minV
      if (props.axis === 'horizontal' || props.axis === 'both') s.minWidth = minV
    }
  }
  if (props.size) {
    const v = sizeVar[props.size]
    if (props.axis === 'vertical' || props.axis === 'both') s.height = v
    if (props.axis === 'horizontal' || props.axis === 'both') s.width = v
    if (props.axis === 'both') {
      s.minWidth = v
      s.minHeight = v
    }
  }
  return s
})
</script>

<template>
  <div
    :class="rootClass"
    :style="rootStyle"
    data-component="Spacer"
    role="none"
    aria-hidden="true"
  />
</template>
