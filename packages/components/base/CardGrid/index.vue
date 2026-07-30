<script setup lang="ts">
import { computed, watch } from 'vue'
import type { CardGridProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<CardGridProps>(), {
  minTrack: 'md',
  fit: 'fill',
  gap: 'lg',
  equalHeight: true
})

const emit = defineEmits<{
  (e: 'layout-change', columns: number | null): void
}>()

const trackMap = {
  sm: 'calc(var(--spacing-2xl) * 6)',
  md: 'calc(var(--spacing-2xl) * 7.5)',
  lg: 'calc(var(--spacing-2xl) * 9)'
} as const

const gapMap = {
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  section: 'var(--theme-section-gap)'
} as const

const cols = computed(() => {
  if (props.columns == null) return null
  return Math.min(6, Math.max(1, Math.floor(props.columns)))
})

watch(cols, (v) => emit('layout-change', v), { immediate: true })

const gridTemplateColumns = computed(() => {
  if (cols.value != null) {
    return `repeat(${cols.value}, minmax(0, 1fr))`
  }
  const track = trackMap[props.minTrack] ?? trackMap.md
  const mode = props.fit === 'fit' ? 'auto-fit' : 'auto-fill'
  return `repeat(${mode}, minmax(${track}, 1fr))`
})

const rootClass = computed(() => [
  'vp-card-grid',
  {
    'vp-card-grid--equal': props.equalHeight
  },
  props.class
])

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  gap: gapMap[props.gap] ?? gapMap.lg,
  gridTemplateColumns: gridTemplateColumns.value
}))
</script>

<template>
  <div :class="rootClass" :style="rootStyle" data-component="CardGrid" role="list">
    <slot />
  </div>
</template>
