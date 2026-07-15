<script setup lang="ts">
import { computed } from 'vue'
import InputText from '../InputText/index.vue'
import ColorPicker from '../ColorPicker/index.vue'
import type { ColorInputProps, ColorInputEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ColorInputProps>(), {
  modelValue: ''
})

const emit = defineEmits<ColorInputEmits>()

const isValidHex = (val: string) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)

const swatchColor = computed(() => (isValidHex(props.modelValue) ? props.modelValue : 'var(--surface-2)'))

const emitValue = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div :class="['vp-color-input', props.class, { 'vp-color-input--invalid': modelValue && !isValidHex(modelValue) }]" :style="style" data-component="ColorInput">
    <span class="vp-color-input__swatch" :style="{ background: swatchColor }" aria-hidden="true" />
    <InputText
      class="vp-color-input__text"
      :model-value="modelValue"
      :disabled="disabled"
      @update:model-value="emitValue"
    />
    <ColorPicker
      class="vp-color-input__picker"
      :model-value="isValidHex(modelValue) ? modelValue : ''"
      :disabled="disabled"
      @update:model-value="emitValue"
    />
  </div>
</template>
