<script setup lang="ts">
import { computed, inject } from 'vue'
import { trackEmit } from '@amg-webui/telemetry'
import type { RadioProps, RadioEmits } from './types'
import { RADIO_GROUP_INJECTION_KEY } from './types'
import { useRadio } from './useRadio'
import './style.scss'

const props = withDefaults(defineProps<RadioProps>(), {
  telemetry: undefined,
  size: undefined
})

const emit = defineEmits<RadioEmits>()
const group = inject(RADIO_GROUP_INJECTION_KEY, null)

const radioSource = computed(() => ({
  modelValue: props.modelValue,
  value: props.value,
  disabled: props.disabled,
  size: props.size,
  name: props.name,
  label: props.label,
  class: props.class,
  group
}))

const { isChecked, isDisabled, inputName, rootClass } = useRadio(radioSource)

const handleChange = () => {
  if (isDisabled.value) return
  if (group) {
    group.change(props.value)
  } else {
    emit('update:modelValue', props.value)
    emit('change', props.value)
  }
  trackEmit({
    component: 'Radio',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value: props.value }
  })
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
      :aria-checked="isChecked"
      @change="handleChange"
    />
    <span class="vp-radio__mark" aria-hidden="true" />
    <span v-if="label || $slots.default" class="vp-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
