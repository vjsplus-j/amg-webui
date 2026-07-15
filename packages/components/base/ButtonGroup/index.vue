<script setup lang="ts">
import { computed, provide } from 'vue'
import { BUTTON_GROUP_KEY } from '../Button/config'
import './style.scss'

/**
 * Props declared inline — Vue SFC does not emit runtime props from imported
 * `ButtonGroupProps` alone (same class of bug as MotionProps).
 */
const props = withDefaults(
  defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    severity?:
      | 'default'
      | 'primary'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'danger'
      | 'info'
      | 'help'
      | 'contrast'
      | 'link'
    variant?: 'solid' | 'outlined' | 'outline' | 'dashed' | 'neon' | 'text' | 'light'
    block?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    block: false
  }
)

provide(BUTTON_GROUP_KEY, {
  get size() {
    return props.size
  },
  get severity() {
    return props.severity
  },
  get variant() {
    return props.variant
  }
})

const rootClass = computed(() => [
  'vp-button-group',
  { 'vp-button-group--block': props.block },
  props.class
])
</script>

<template>
  <div :class="rootClass" :style="style" role="group">
    <slot />
  </div>
</template>
