<script setup lang="ts">
import { computed } from 'vue'
import type {
  BlockBg,
  BlockDisplay,
  BlockGap,
  BlockMargin,
  BlockPadding,
  BlockRadius
} from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    display?: BlockDisplay
    padding?: BlockPadding
    padded?: boolean
    bordered?: boolean
    gap?: BlockGap
    margin?: BlockMargin
    bg?: BlockBg
    fullBleed?: boolean
    radius?: BlockRadius
    raised?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    display: 'block',
    padded: true,
    bordered: false,
    gap: true,
    margin: 'none',
    bg: 'surface-1',
    fullBleed: false,
    radius: 'card',
    raised: false
  }
)

const marginVar: Record<BlockMargin, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  section: 'var(--theme-section-gap)'
}

const paddingVar: Record<BlockPadding, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  card: 'var(--theme-card-pad)',
  page: 'var(--theme-page-pad)'
}

const gapVar: Record<string, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  section: 'var(--theme-section-gap)'
}

function resolvePadding(): string {
  if (props.padding != null) return paddingVar[props.padding] ?? paddingVar.card
  return props.padded ? paddingVar.card : paddingVar.none
}

function resolveGap(): string {
  const g = props.gap
  if (g === false || g === 'none') return '0'
  if (g === true) return gapVar.md
  return gapVar[g] ?? gapVar.md
}

const resolvedPadding = computed(() => resolvePadding())
const resolvedGap = computed(() => resolveGap())
const hasGap = computed(() => resolvedGap.value !== '0')

const rootClass = computed(() => [
  'vp-block',
  `vp-block--display-${props.display}`,
  `vp-block--bg-${props.bg}`,
  `vp-block--radius-${props.radius}`,
  `vp-block--margin-${props.margin}`,
  {
    'vp-block--bordered': props.bordered,
    'vp-block--full-bleed': props.fullBleed,
    'vp-block--raised': props.raised,
    'vp-block--gap': hasGap.value,
    'vp-block--padded': resolvedPadding.value !== '0'
  },
  props.class
])

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  margin: marginVar[props.margin] ?? '0',
  '--vp-block-pad': resolvedPadding.value,
  '--vp-block-gap': resolvedGap.value
}))
</script>

<template>
  <div role="presentation" :class="rootClass" :style="rootStyle" data-component="Block">
    <div class="vp-block__body">
      <slot></slot>
    </div>
  </div>
</template>
