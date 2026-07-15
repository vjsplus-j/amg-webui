<script setup lang="ts">
import { provide, computed } from 'vue'
import type { CheckboxGroupProps, CheckboxGroupEmits } from '../Checkbox/types'
import { CHECKBOX_GROUP_INJECTION_KEY } from './types'
import './style.scss'

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  modelValue: () => [],
  direction: 'horizontal'
})

const emit = defineEmits<CheckboxGroupEmits>()

const toggle = (value: unknown, checked: boolean) => {
  if (props.disabled) return
  const current = [...(props.modelValue ?? [])]
  const idx = current.indexOf(value)
  if (checked && idx < 0) {
    current.push(value)
  } else if (!checked && idx >= 0) {
    current.splice(idx, 1)
  }
  emit('update:modelValue', current)
  emit('change', current)
}

provide(CHECKBOX_GROUP_INJECTION_KEY, {
  get modelValue() {
    return props.modelValue ?? []
  },
  disabled: props.disabled ?? false,
  toggle
})

const rootClass = computed(() => [
  'vp-checkboxgroup',
  `vp-checkboxgroup--${props.direction}`,
  props.class
])
</script>

<template>
  <div :class="rootClass" :style="style" role="group">
    <slot />
  </div>
</template>
