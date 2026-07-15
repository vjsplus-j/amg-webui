<script setup lang="ts">
import { computed } from 'vue'
import type { ColProps } from './types'
import './style.scss'

const props = defineProps<ColProps & { gutter?: number | string; span?: number; wrap?: boolean; direction?: 'horizontal' | 'vertical'; align?: string; justify?: string }>()

const rootClass = computed(() => [
  'vp-col',
  props.class,
  { 'vp-col--wrap': props.wrap !== false }
])

const rootStyle = computed(() => {
  const s: Record<string, string> = { ...(props.style || {}) }
  
  s.flex = props.span != null ? `0 0 ${(Number(props.span) / 24) * 100}%` : '1 1 auto'
  s.maxWidth = props.span != null ? `${(Number(props.span) / 24) * 100}%` : undefined as unknown as string
  
  return s
})
</script>

<template>
  <div :class="rootClass" :style="rootStyle">
    <slot />
  </div>
</template>
