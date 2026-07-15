<script setup lang="ts">
import { computed } from 'vue'
import type { RowProps } from './types'
import './style.scss'

const props = defineProps<RowProps & { gutter?: number | string; span?: number; wrap?: boolean; direction?: 'horizontal' | 'vertical'; align?: string; justify?: string }>()

const rootClass = computed(() => [
  'vp-row',
  props.class,
  { 'vp-row--wrap': props.wrap !== false }
])

const rootStyle = computed(() => {
  const s: Record<string, string> = { ...(props.style || {}) }
  s.display = 'flex'
  s.flexDirection = props.direction === 'vertical' ? 'column' : 'row'
  s.flexWrap = props.wrap === false ? 'nowrap' : 'wrap'
  s.gap = props.gutter != null ? (typeof props.gutter === 'number' ? `${props.gutter}px` : String(props.gutter)) : 'var(--spacing-md)'
  if (props.align) s.alignItems = props.align
  if (props.justify) s.justifyContent = props.justify
  
  
  return s
})
</script>

<template>
  <div :class="rootClass" :style="rootStyle">
    <slot />
  </div>
</template>
