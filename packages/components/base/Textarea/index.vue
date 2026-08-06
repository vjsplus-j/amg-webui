<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { trackEmit } from '@amg-webui/telemetry'
import { applySanitizeInput } from '@amg-webui/security'
import type { TextareaProps, TextareaEmits } from './types'
import { useTextarea } from './useTextarea'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'Textarea' })

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  rows: 4,
  cols: 50,
  size: 'md',
  sanitizeInput: true,
  telemetry: undefined
})

const emit = defineEmits<TextareaEmits>()

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
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const { textareaClass, characterCount, resizeTextarea } = useTextarea(
  props,
  textareaRef,
  { invalid: isInvalid, disabled: isDisabled }
)

onMounted(() => {
  if (props.autoResize) {
    resizeTextarea()
  }
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const next = applySanitizeInput(target.value, props.sanitizeInput, 'input')
  if (next !== target.value) target.value = next
  emit('update:modelValue', next)
  emit('input', event)
  void validateOnChange()
  if (props.autoResize) {
    resizeTextarea()
  }
  trackEmit({
    component: 'Textarea',
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
  const target = event.target as HTMLTextAreaElement
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
  <div class="p-textarea-wrapper">
    <textarea
      ref="textareaRef"
      v-bind="nativeAttrs"
      :id="inputId"
      :class="textareaClass"
      :name="resolvedName"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :rows="rows"
      :cols="cols"
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

    <span v-if="showCounter && maxlength" class="p-textarea-counter">
      {{ characterCount }} / {{ maxlength }}
    </span>

    <slot />
  </div>
</template>
