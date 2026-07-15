<script setup lang="ts">
import { computed } from 'vue'
import type { ScaleLayoutProps } from './types'
import './style.scss'

const props = defineProps<ScaleLayoutProps & { gutter?: number | string; span?: number; wrap?: boolean; direction?: 'horizontal' | 'vertical'; align?: string; justify?: string }>()

const rootClass = computed(() => [
  'vp-scale-layout',
  props.class,
  { 'vp-scale-layout--wrap': props.wrap !== false }
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
