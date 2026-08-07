<script setup lang="ts">
import { computed, provide } from 'vue'
import { BUTTON_GROUP_KEY } from '@amg-webui/core/Button/config'
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
    direction?: 'horizontal' | 'vertical'
    disabled?: boolean
    loading?: boolean
    ariaLabel?: string
    class?: string
    style?: Record<string, string>
  }>(),
  {
    block: false,
    direction: 'horizontal',
    disabled: false,
    loading: false
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
  },
  get disabled() {
    return props.disabled
  },
  get loading() {
    return props.loading
  }
})

const isBusy = computed(() => Boolean(props.loading))
const isGroupDisabled = computed(() => Boolean(props.disabled))

const rootClass = computed(() => [
  'vp-button-group',
  `vp-button-group--${props.direction}`,
  props.size ? `vp-button-group--size-${props.size}` : '',
  {
    'vp-button-group--block': props.block,
    'vp-button-group--disabled': isGroupDisabled.value,
    'vp-button-group--loading': isBusy.value
  },
  props.class
])

</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    role="group"
    :aria-label="ariaLabel"
    :aria-disabled="isGroupDisabled || undefined"
    :aria-busy="isBusy || undefined"
  >
    <slot />
  </div>
</template>
