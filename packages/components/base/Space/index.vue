<script setup lang="ts">
import { computed } from 'vue'
import type { Size } from '@amg-webui/types'
import { SPACE_SIZES } from './types'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** xs 极小 · sm 小 · md 中 · lg 大 · xl 极大 */
    size?: Size | string
    gap?: Size | string
    gutter?: number | string
    direction?: 'horizontal' | 'vertical'
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
    wrap?: boolean
    block?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    size: 'md',
    direction: 'horizontal',
    wrap: true,
    block: false
  }
)

const SIZE_GAP: Record<Size, string> = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)'
}

function resolveGap(raw: unknown): string {
  if (raw == null || raw === '') return SIZE_GAP.md
  if (typeof raw === 'number') {
    /* 0–4 → xs…xl */
    return SIZE_GAP[SPACE_SIZES[Math.min(Math.max(Math.floor(raw), 0), 4)]!] ?? SIZE_GAP.md
  }
  const s = String(raw)
  if (s in SIZE_GAP) return SIZE_GAP[s as Size]
  return s
}

const sizeKey = computed(() => {
  const raw = props.gap ?? props.size ?? props.gutter ?? 'md'
  const s = String(raw)
  return (SPACE_SIZES as readonly string[]).includes(s) ? (s as Size) : null
})

const resolvedGap = computed(() =>
  resolveGap(props.gap ?? props.size ?? props.gutter ?? 'md')
)

const rootClass = computed(() => [
  'vp-space',
  `vp-space--${props.direction}`,
  sizeKey.value ? `vp-space--${sizeKey.value}` : '',
  {
    'vp-space--wrap': props.wrap !== false && props.direction === 'horizontal',
    'vp-space--block': props.block
  },
  props.class
])

const rootStyle = computed(() => {
  const s: Record<string, string> = {
    ...(props.style || {}),
    gap: resolvedGap.value
  }
  if (props.align) {
    const map: Record<string, string> = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      baseline: 'baseline',
      stretch: 'stretch'
    }
    s.alignItems = map[props.align] ?? props.align
  }
  if (props.justify) {
    const map: Record<string, string> = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      'space-between': 'space-between',
      'space-around': 'space-around',
      'space-evenly': 'space-evenly'
    }
    s.justifyContent = map[props.justify] ?? props.justify
  }
  return s
})
</script>

<template>
  <div :class="rootClass" :style="rootStyle">
    <slot />
  </div>
</template>
