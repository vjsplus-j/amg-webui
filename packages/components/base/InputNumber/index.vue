<script setup lang="ts">
import type { InputNumberProps, InputNumberEmits } from './types'
import { useInputNumber } from './useInputNumber'
import './style.scss'

const props = withDefaults(defineProps<InputNumberProps>(), {
  modelValue: null,
  step: 1,
  controls: true,
  size: 'md'
})

const emit = defineEmits<InputNumberEmits>()

const { rootClass, increment, decrement, parseInput } = useInputNumber(props)

const displayValue = () =>
  props.modelValue == null ? '' : String(props.modelValue)

const emitValue = (value: number | null) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emitValue(parseInput(target.value))
}

const handleDecrease = () => {
  if (props.disabled) return
  emitValue(decrement(props.modelValue))
}

const handleIncrease = () => {
  if (props.disabled) return
  emitValue(increment(props.modelValue))
}

const handleFocus = (event: FocusEvent) => emit('focus', event)
const handleBlur = (event: FocusEvent) => emit('blur', event)
</script>

<template>
  <div :class="rootClass" :style="style">
    <button
      v-if="controls"
      type="button"
      class="vp-inputnumber__btn"
      :disabled="disabled"
      aria-hidden="true"
      tabindex="-1"
      @click="handleDecrease"
    >
      ±
    </button>
    <input
      class="vp-inputnumber__input"
      type="text"
      inputmode="decimal"
      :value="displayValue()"
      :disabled="disabled"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <button
      v-if="controls"
      type="button"
      class="vp-inputnumber__btn"
      :disabled="disabled"
      aria-hidden="true"
      tabindex="-1"
      @click="handleIncrease"
    >
      +
    </button>
  </div>
</template>
