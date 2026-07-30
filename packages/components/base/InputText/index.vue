<script setup lang="ts">
import type { InputTextProps, InputTextEmits } from './types'
import { useInputText } from './useInputText'
import './style.scss'

const props = withDefaults(defineProps<InputTextProps>(), {
  modelValue: '',
  size: 'md',
  type: 'text',
  telemetry: undefined
})

const emit = defineEmits<InputTextEmits>()

const { inputClass } = useInputText(props)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
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
      :class="inputClass"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :style="style"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
    />
    <slot name="leftIcon" />
    <slot name="rightIcon" />
  </div>
</template>
