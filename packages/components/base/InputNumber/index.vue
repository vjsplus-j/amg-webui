<script setup lang="ts">
import type { InputNumberProps, InputNumberEmits } from './types'
import { useInputNumber } from './useInputNumber'
import Icon from '../Icon/index.vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import './style.scss'

const props = withDefaults(defineProps<InputNumberProps>(), {
  modelValue: null,
  step: 1,
  controls: true,
  size: 'md'
})

const emit = defineEmits<InputNumberEmits>()
const { t } = useLocale()

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
  if (props.disabled || props.readonly) return
  emitValue(decrement(props.modelValue))
}

const handleIncrease = () => {
  if (props.disabled || props.readonly) return
  emitValue(increment(props.modelValue))
}

const handleFocus = (event: FocusEvent) => emit('focus', event)
const handleBlur = (event: FocusEvent) => emit('blur', event)
const atMin = () => props.modelValue != null && props.min != null && props.modelValue <= props.min
const atMax = () => props.modelValue != null && props.max != null && props.modelValue >= props.max
</script>

<template>
  <div :class="rootClass" :style="style">
    <button
      v-if="controls"
      type="button"
      class="vp-inputnumber__btn"
      :disabled="disabled || readonly || atMin()"
      :aria-label="t(LocaleKeys.common.previous)"
      @click="handleDecrease"
    >
      <Icon name="Minus" size="sm" />
    </button>
    <input
      class="vp-inputnumber__input"
      type="text"
      inputmode="decimal"
      :value="displayValue()"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      :aria-invalid="invalid || undefined"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <button
      v-if="controls"
      type="button"
      class="vp-inputnumber__btn"
      :disabled="disabled || readonly || atMax()"
      :aria-label="t(LocaleKeys.common.next)"
      @click="handleIncrease"
    >
      <Icon name="Plus" size="sm" />
    </button>
  </div>
</template>
