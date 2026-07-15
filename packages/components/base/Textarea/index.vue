<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TextareaProps, TextareaEmits } from './types'
import { useTextarea } from './useTextarea'
import './style.scss'

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  rows: 4,
  cols: 50,
  size: 'md'
})

const emit = defineEmits<TextareaEmits>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const { textareaClass, characterCount, resizeTextarea } = useTextarea(props, textareaRef)

onMounted(() => {
  if (props.autoResize) {
    resizeTextarea()
  }
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', event)
  
  if (props.autoResize) {
    resizeTextarea()
  }
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
  <div class="p-textarea-wrapper">
    <textarea
      ref="textareaRef"
      :class="textareaClass"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :rows="rows"
      :cols="cols"
      :style="style"
      @input="handleInput"
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
