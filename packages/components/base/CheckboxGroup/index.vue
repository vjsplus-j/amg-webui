<script setup lang="ts">
import { computed, provide } from 'vue'
import Checkbox from '../Checkbox/index.vue'
import { CHECKBOX_GROUP_INJECTION_KEY } from '../Checkbox/types'
import type { CheckboxGroupProps, CheckboxGroupEmits } from './types'
import { useCheckboxGroup } from './useCheckboxGroup'
import './style.scss'

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  modelValue: () => [],
  direction: 'horizontal',
  size: 'md',
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<CheckboxGroupEmits>()

const groupSource = computed(() => ({
  direction: props.direction,
  size: props.size,
  disabled: props.disabled,
  options: props.options,
  modelValue: props.modelValue,
  max: props.max,
  min: props.min,
  class: props.class
}))

const { orientation, optionList, selectedCount, atMax, rootClass } =
  useCheckboxGroup(groupSource)

const toggle = (value: unknown, checked: boolean) => {
  if (props.disabled) return
  const current = [...(props.modelValue ?? [])]
  const idx = current.indexOf(value)
  if (checked && idx < 0) {
    if (props.max != null && current.length >= props.max) return
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
  get disabled() {
    return props.disabled ?? false
  },
  get size() {
    return props.size
  },
  toggle
})
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    role="group"
    :aria-label="ariaLabel"
    :aria-orientation="orientation"
    :aria-disabled="disabled || undefined"
    :data-selected="selectedCount"
    :data-at-max="atMax || undefined"
  >
    <Checkbox
      v-for="(opt, idx) in optionList"
      :key="`${String(opt.value)}-${idx}`"
      :value="opt.value"
      :label="opt.label"
      :disabled="opt.disabled || (atMax && !(modelValue ?? []).includes(opt.value))"
      :size="size"
      :track-id="trackId"
      :telemetry="telemetry"
    />
    <slot />
  </div>
</template>
