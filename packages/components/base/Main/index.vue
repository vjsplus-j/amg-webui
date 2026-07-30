<script setup lang="ts">
import { computed } from 'vue'
import type { MainPadding } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    padded?: boolean
    padding?: MainPadding
    label?: string
    overflow?: 'auto' | 'hidden' | 'visible'
    fill?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    padded: true,
    overflow: 'auto',
    fill: true
  }
)

const emit = defineEmits<{
  scroll: [event: Event]
}>()

const padMap: Record<MainPadding, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  page: 'var(--theme-page-pad)',
  card: 'var(--theme-card-pad)'
}

function resolvePad(): string {
  if (props.padding != null) return padMap[props.padding] ?? padMap.page
  return props.padded ? padMap.page : padMap.none
}

const resolvedPad = computed(() => resolvePad())

const rootClass = computed(() => [
  'vp-main',
  {
    'vp-main--padded': resolvedPad.value !== '0',
    'vp-main--flush': resolvedPad.value === '0',
    'vp-main--fill': props.fill,
    [`vp-main--overflow-${props.overflow}`]: true
  },
  props.class
])

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  '--vp-main-pad': resolvedPad.value
}))

function onScroll(event: Event) {
  emit('scroll', event)
}
</script>

<template>
  <main
    :class="rootClass"
    :style="rootStyle"
    :aria-label="label"
    data-component="Main"
    @scroll="onScroll"
  >
    <div class="vp-main__body">
      <slot></slot>
    </div>
  </main>
</template>
