<script setup lang="ts">
import { computed } from 'vue'
import type { CardGridProps } from './types'
import './style.scss'

const props = defineProps<CardGridProps & { gutter?: number | string; span?: number; wrap?: boolean; direction?: 'horizontal' | 'vertical'; align?: string; justify?: string }>()

const rootClass = computed(() => [
  'vp-card-grid',
  props.class,
  { 'vp-card-grid--wrap': props.wrap !== false }
])

const rootStyle = computed(() => {
  const s: Record<string, string> = { ...(props.style || {}) }
  
  
  s.display = 'block'
  return s
})
</script>

<template>
  <div :class="rootClass" :style="rootStyle">
    <slot />
  </div>
</template>
