<script setup lang="ts">
import { computed, inject } from 'vue'
import type { RadioProps, RadioEmits } from './types'
import { RADIO_GROUP_INJECTION_KEY } from './types'
import './style.scss'

const props = defineProps<RadioProps>()
const emit = defineEmits<RadioEmits>()

const group = inject(RADIO_GROUP_INJECTION_KEY, null)

const isChecked = computed(() => {
  const current = group ? group.modelValue : props.modelValue
  return current === props.value
})

const isDisabled = computed(() => props.disabled || group?.disabled || false)
const inputName = computed(() => group?.name ?? props.name)

const rootClass = computed(() => [
  'vp-radio',
  { 'vp-radio--disabled': isDisabled.value },
  props.class
])

const handleChange = () => {
  if (isDisabled.value) return
  if (group) {
    group.change(props.value)
  } else {
    emit('update:modelValue', props.value)
    emit('change', props.value)
  }
}
</script>

<template>
  <label :class="rootClass" :style="style">
    <input
      class="vp-radio__input"
      type="radio"
      :name="inputName"
      :value="String(value)"
      :checked="isChecked"
      :disabled="isDisabled"
      @change="handleChange"
    />
    <span class="vp-radio__mark" aria-hidden="true" />
    <span v-if="label || $slots.default" class="vp-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
