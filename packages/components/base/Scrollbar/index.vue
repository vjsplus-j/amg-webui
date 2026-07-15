<script setup lang="ts">
import { computed } from 'vue'
import type { ScrollbarProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<ScrollbarProps>(), {
  native: false
})

function toCssSize(val?: string | number): string | undefined {
  if (val == null) return undefined
  return typeof val === 'number' ? `${val}px` : val
}

const wrapStyle = computed(() => ({
  height: toCssSize(props.height),
  maxHeight: toCssSize(props.maxHeight)
}))
</script>

<template>
  <div
    :class="[
      'vp-scrollbar',
      { 'vp-scrollbar--native': native },
      props.class
    ]"
    :style="{ ...wrapStyle, ...style }"
  >
    <slot />
  </div>
</template>
