<script setup lang="ts">
import { computed } from 'vue'
import type { ContainerProps, ContainerSize } from './types'
import './style.scss'

const props = withDefaults(defineProps<ContainerProps>(), {
  size: 'lg',
  fluid: false,
  padded: true,
  align: 'center',
  gap: 'none',
  tag: 'div',
  fullBleed: false
})

const gapMap: Record<string, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  section: 'var(--theme-section-gap)'
}

const effectiveSize = computed<ContainerSize>(() =>
  props.fluid || props.size === 'fluid' || props.size === 'full' ? 'fluid' : props.size
)

const rootClass = computed(() => [
  'vp-container',
  `vp-container--${effectiveSize.value}`,
  `vp-container--align-${props.align}`,
  {
    'vp-container--padded': props.padded,
    'vp-container--fluid': effectiveSize.value === 'fluid',
    'vp-container--stack': props.gap !== 'none'
  },
  props.class
])

const rootStyle = computed(() => {
  const base: Record<string, string> = { ...(props.style ?? {}) }
  if (props.gap !== 'none') {
    base.gap = gapMap[props.gap] ?? '0'
    base.display = 'flex'
    base.flexDirection = 'column'
  }
  if (props.maxWidth) base.maxWidth = props.maxWidth
  if (props.fullBleed) {
    base.maxWidth = '100%'
    base.paddingInline = '0'
  }
  return base
})
</script>

<template>
  <component
    :is="tag"
    :class="rootClass"
    :style="rootStyle"
    data-component="Container"
    :role="tag === 'div' ? 'group' : undefined"
    :aria-label="ariaLabel"
  >
    <slot />
  </component>
</template>
