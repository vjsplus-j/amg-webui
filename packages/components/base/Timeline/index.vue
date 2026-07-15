<script setup lang="ts">
import { provide } from 'vue'
import type { TimelineProps } from './types'
import { TIMELINE_INJECTION_KEY } from './types'
import './style.scss'

const props = withDefaults(defineProps<TimelineProps>(), {
  pending: false
})

provide(TIMELINE_INJECTION_KEY, {
  pending: props.pending
})
</script>

<template>
  <ul
    :class="[
      'vp-timeline',
      { 'vp-timeline--pending': pending },
      props.class
    ]"
    :style="style"
  >
    <slot />
  </ul>
</template>
