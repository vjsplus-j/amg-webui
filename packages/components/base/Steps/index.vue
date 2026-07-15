<script setup lang="ts">
import { provide, toRef } from 'vue'
import type { StepsProps } from './types'
import { STEPS_INJECTION_KEY } from './types'
import './style.scss'

const props = withDefaults(defineProps<StepsProps>(), {
  active: 0,
  direction: 'horizontal'
})

provide(STEPS_INJECTION_KEY, {
  active: toRef(() => props.active),
  direction: toRef(() => props.direction)
})
</script>

<template>
  <ol
    :class="['vp-steps', `vp-steps--${direction}`, props.class]"
    :style="style"
  >
    <slot />
  </ol>
</template>
