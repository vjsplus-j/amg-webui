<script setup lang="ts">
import type { InputNumberProps, InputNumberEmits } from './types'
import { useInputNumber } from './useInputNumber'
import Icon from '@amg-webui/core/Icon/index.vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'InputNumber' })

const props = withDefaults(defineProps<InputNumberProps>(), {
  modelValue: null,
  step: 1,
  controls: true,
  size: 'md',
  telemetry: undefined,
  skipFormItem: false
})

const emit = defineEmits<InputNumberEmits>()
const { t } = useLocale()

const {
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  name: resolvedName,
  validateOnBlur,
  validateOnChange
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
  name: () => props.name,
  skip: () => props.skipFormItem
})

const { nativeAttrs } = useNativeInputAttrs()
const { rootClass, increment, decrement, parseInput } = useInputNumber(props, {
  invalid: isInvalid,
  disabled: isDisabled
})

const displayValue = () =>
  props.modelValue == null ? '' : String(props.modelValue)

const emitValue = (value: number | null) => {
  emit('update:modelValue', value)
  emit('change', value)
  void validateOnChange()
  trackEmit({
    component: 'InputNumber',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value }
  })
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emitValue(parseInput(target.value))
}

const handleDecrease = () => {
  if (isDisabled.value || props.readonly) return
  emitValue(decrement(props.modelValue))
}

const handleIncrease = () => {
  if (isDisabled.value || props.readonly) return
  emitValue(increment(props.modelValue))
}

const handleFocus = (event: FocusEvent) => emit('focus', event)
const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
  void validateOnBlur()
}
const atMin = () => props.modelValue != null && props.min != null && props.modelValue <= props.min
const atMax = () => props.modelValue != null && props.max != null && props.modelValue >= props.max
</script>

<template>
  <div :class="rootClass" :style="style">
    <button
      v-if="controls"
      type="button"
      class="vp-inputnumber__btn"
      tabindex="-1"
      :disabled="isDisabled || readonly || atMin()"
      :aria-label="t(LocaleKeys.common.previous)"
      @click="handleDecrease"
    >
      <Icon name="Minus" size="sm" />
    </button>
    <input
      v-bind="nativeAttrs"
      :id="inputId"
      class="vp-inputnumber__input"
      type="text"
      inputmode="decimal"
      :name="resolvedName"
      :value="displayValue()"
      :disabled="isDisabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-label="ariaLabel"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <button
      v-if="controls"
      type="button"
      class="vp-inputnumber__btn"
      tabindex="-1"
      :disabled="isDisabled || readonly || atMax()"
      :aria-label="t(LocaleKeys.common.next)"
      @click="handleIncrease"
    >
      <Icon name="Plus" size="sm" />
    </button>
  </div>
</template>
