<script setup lang="ts">
import { computed, provide } from 'vue'
import Radio from '../Radio/index.vue'
import { RADIO_GROUP_INJECTION_KEY } from '../Radio/types'
import type { RadioGroupProps, RadioGroupEmits } from './types'
import { useRadioGroup } from './useRadioGroup'
import './style.scss'

const props = withDefaults(defineProps<RadioGroupProps>(), {
  direction: 'horizontal',
  size: 'md',
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<RadioGroupEmits>()

const groupSource = computed(() => ({
  direction: props.direction,
  size: props.size,
  disabled: props.disabled,
  options: props.options,
  class: props.class
}))

const { orientation, optionList, rootClass } = useRadioGroup(groupSource)

const change = (value: unknown) => {
  if (props.disabled) return
  emit('update:modelValue', value)
  emit('change', value)
}

provide(RADIO_GROUP_INJECTION_KEY, {
  get modelValue() {
    return props.modelValue
  },
  get disabled() {
    return props.disabled ?? false
  },
  get name() {
    return props.name
  },
  get size() {
    return props.size
  },
  change
})
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    role="radiogroup"
    :aria-label="ariaLabel"
    :aria-orientation="orientation"
    :aria-disabled="disabled || undefined"
  >
    <Radio
      v-for="(opt, idx) in optionList"
      :key="`${String(opt.value)}-${idx}`"
      :value="opt.value"
      :label="opt.label"
      :disabled="opt.disabled"
      :size="size"
      :track-id="trackId"
      :telemetry="telemetry"
    />
    <slot />
  </div>
</template>
