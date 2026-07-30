<script setup lang="ts">
import { computed } from 'vue'
import type { StackAlign, StackGap, StackJustify } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    direction?: 'vertical' | 'horizontal'
    gap?: StackGap
    align?: StackAlign
    justify?: StackJustify
    wrap?: boolean
    inline?: boolean
    block?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    direction: 'vertical',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
    inline: false,
    block: true
  }
)

const gapMap: Record<StackGap, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
  section: 'var(--theme-section-gap)'
}

const alignMap: Record<StackAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline'
}

const justifyMap: Record<StackJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  'space-between': 'space-between',
  'space-around': 'space-around',
  'space-evenly': 'space-evenly'
}

const rootClass = computed(() => [
  'vp-stack-layout',
  `vp-stack-layout--${props.direction}`,
  `vp-stack-layout--gap-${props.gap}`,
  `vp-stack-layout--align-${props.align}`,
  `vp-stack-layout--justify-${props.justify}`,
  {
    'vp-stack-layout--wrap': props.wrap,
    'vp-stack-layout--inline': props.inline,
    'vp-stack-layout--block': props.block && !props.inline
  },
  props.class
])

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  gap: gapMap[props.gap] ?? gapMap.md,
  alignItems: alignMap[props.align],
  justifyContent: justifyMap[props.justify],
  '--vp-stack-gap': gapMap[props.gap] ?? gapMap.md
}))
</script>

<template>
  <div :class="rootClass" :style="rootStyle" data-component="StackLayout" role="group">
    <slot></slot>
  </div>
</template>
