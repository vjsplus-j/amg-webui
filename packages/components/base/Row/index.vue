<script setup lang="ts">
import { computed, provide } from 'vue'
import { ROW_GUTTER_KEY, type RowAlign, type RowGutter, type RowJustify } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    gutter?: RowGutter
    wrap?: boolean
    align?: RowAlign
    justify?: RowJustify
    class?: string
    style?: Record<string, string>
  }>(),
  {
    gutter: 'md',
    wrap: true,
    align: 'stretch',
    justify: 'start'
  }
)

const GUTTER_TOKEN: Record<string, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
  section: 'var(--theme-section-gap)'
}

function resolveGutter(g: RowGutter | undefined): string {
  if (g == null) return GUTTER_TOKEN.md
  if (typeof g === 'number') {
    if (g === 0) return '0'
    return `calc(var(--spacing-xs) * ${g})`
  }
  const key = String(g)
  if (key in GUTTER_TOKEN) return GUTTER_TOKEN[key]!
  return key
}

const gutterCss = computed(() => resolveGutter(props.gutter))
provide(ROW_GUTTER_KEY, gutterCss)

const alignMap: Record<RowAlign, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch',
  baseline: 'baseline'
}

const justifyMap: Record<RowJustify, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  'space-between': 'space-between',
  'space-around': 'space-around',
  'space-evenly': 'space-evenly'
}

const rootClass = computed(() => [
  'vp-row',
  `vp-row--align-${props.align}`,
  `vp-row--justify-${props.justify}`,
  { 'vp-row--nowrap': props.wrap === false },
  props.class
])

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  gap: gutterCss.value,
  alignItems: alignMap[props.align] ?? props.align,
  justifyContent: justifyMap[props.justify] ?? props.justify,
  '--vp-row-gutter': gutterCss.value
}))
</script>

<template>
  <div :class="rootClass" :style="rootStyle" data-component="Row" role="row">
    <slot />
  </div>
</template>
