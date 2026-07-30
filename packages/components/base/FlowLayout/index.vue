<script setup lang="ts">
import { computed } from 'vue'
import type { FlowAlign, FlowGap, FlowJustify } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    gap?: FlowGap
    rowGap?: FlowGap
    columnGap?: FlowGap
    align?: FlowAlign
    justify?: FlowJustify
    reverse?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    gap: 'md',
    align: 'start',
    justify: 'start',
    reverse: false
  }
)

const gapMap: Record<FlowGap, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
  section: 'var(--theme-section-gap)'
}

const alignMap: Record<FlowAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline'
}

const justifyMap: Record<FlowJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  'space-between': 'space-between',
  'space-around': 'space-around',
  'space-evenly': 'space-evenly'
}

const resolvedGap = computed(() => gapMap[props.gap] ?? gapMap.md)
const resolvedRowGap = computed(
  () => gapMap[props.rowGap ?? props.gap] ?? resolvedGap.value
)
const resolvedColGap = computed(
  () => gapMap[props.columnGap ?? props.gap] ?? resolvedGap.value
)

const rootClass = computed(() => [
  'vp-flow-layout',
  `vp-flow-layout--align-${props.align}`,
  `vp-flow-layout--justify-${props.justify}`,
  { 'vp-flow-layout--reverse': props.reverse },
  props.class
])

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  gap: resolvedGap.value,
  rowGap: resolvedRowGap.value,
  columnGap: resolvedColGap.value,
  alignItems: alignMap[props.align],
  justifyContent: justifyMap[props.justify],
  '--vp-flow-gap': resolvedGap.value
}))
</script>

<template>
  <div :class="rootClass" :style="rootStyle" data-component="FlowLayout" role="group">
    <slot></slot>
  </div>
</template>
