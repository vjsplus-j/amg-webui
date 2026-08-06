<script setup lang="ts">
import { trackEmit } from '@amg-webui/telemetry'
import { applySanitizeInput } from '@amg-webui/security'
import type { InputTextProps, InputTextEmits } from './types'
import { useInputText } from './useInputText'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'InputText' })

const props = withDefaults(defineProps<InputTextProps>(), {
  modelValue: '',
  size: 'md',
  type: 'text',
  sanitizeInput: true,
  telemetry: undefined
})

const emit = defineEmits<InputTextEmits>()

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
  name: () => props.name
})

const { nativeAttrs } = useNativeInputAttrs()
const { inputClass } = useInputText(props, {
  invalid: isInvalid,
  disabled: isDisabled
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const next = applySanitizeInput(target.value, props.sanitizeInput, 'input')
  if (next !== target.value) target.value = next
  emit('update:modelValue', next)
  emit('input', event)
  void validateOnChange()
  trackEmit({
    component: 'InputText',
    type: 'input',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { length: next.length }
  })
}

const handleChange = (event: Event) => {
  emit('change', event)
  void validateOnChange()
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement
  const next = applySanitizeInput(target.value, props.sanitizeInput, 'blur')
  if (next !== target.value) {
    target.value = next
    emit('update:modelValue', next)
  }
  emit('blur', event)
  void validateOnBlur()
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const handleKeyup = (event: KeyboardEvent) => {
  emit('keyup', event)
}
</script>

<template>
  <div class="p-inputtext-wrapper">
    <input
      v-bind="nativeAttrs"
      :id="inputId"
      :class="inputClass"
      :type="type"
      :name="resolvedName"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :autocomplete="autocomplete"
      :aria-label="ariaLabel"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      :style="style"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
    />
    <slot name="leftIcon" />
    <slot name="rightIcon" />
  </div>
</template>
