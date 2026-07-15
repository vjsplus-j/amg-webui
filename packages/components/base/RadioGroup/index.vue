<script setup lang="ts">
import { provide, computed } from 'vue'
import type { RadioGroupProps, RadioGroupEmits } from '../Radio/types'
import { RADIO_GROUP_INJECTION_KEY } from './types'
import './style.scss'

const props = withDefaults(defineProps<RadioGroupProps>(), {
  direction: 'horizontal'
})

const emit = defineEmits<RadioGroupEmits>()

const change = (value: unknown) => {
  if (props.disabled) return
  emit('update:modelValue', value)
  emit('change', value)
}

provide(RADIO_GROUP_INJECTION_KEY, {
  get modelValue() {
    return props.modelValue
  },
  disabled: props.disabled ?? false,
  name: props.name,
  change
})

const rootClass = computed(() => [
  'vp-radiogroup',
  `vp-radiogroup--${props.direction}`,
  props.class
])
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    role="radiogroup"
  >
    <slot />
  </div>
</template>
