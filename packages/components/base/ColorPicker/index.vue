<script setup lang="ts">
import { computed } from 'vue'
import { usePopover } from '@amg-webui/hooks'
import { cssVarToHex } from '@amg-webui/utils'
import type { ColorPickerProps, ColorPickerEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: '',
  presets: () => [
    'var(--primary-500)',
    'var(--success-500)',
    'var(--warning-500)',
    'var(--danger-500)',
    'var(--info-500)',
    'var(--text-primary)',
    'var(--surface-3)',
    'var(--primary-300)',
    'var(--success-300)',
    'var(--warning-300)',
    'var(--danger-300)',
    'var(--text-muted)'
  ]
})

const emit = defineEmits<ColorPickerEmits>()

const { isOpen, triggerRef, panelRef, toggle } = usePopover()

const displayColor = computed(() => props.modelValue || 'var(--surface-2)')

const handleTriggerClick = () => {
  if (props.disabled) return
  toggle()
}

const emitValue = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const selectPreset = (preset: string) => {
  emitValue(cssVarToHex(preset))
}

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emitValue(value)
}
</script>

<template>
  <div :class="['vp-colorpicker', props.class]" :style="style">
    <button
      ref="triggerRef"
      type="button"
      class="vp-colorpicker__trigger"
      :disabled="disabled"
      @click="handleTriggerClick"
    >
      <span class="vp-colorpicker__swatch" :style="{ background: displayColor }" />
      <span class="vp-colorpicker__value">{{ modelValue || '' }}</span>
    </button>

    <div v-if="isOpen" ref="panelRef" class="vp-colorpicker__panel">
      <div class="vp-colorpicker__presets">
        <button
          v-for="(preset, index) in presets"
          :key="index"
          type="button"
          class="vp-colorpicker__preset"
          :class="{ 'vp-colorpicker__preset--active': cssVarToHex(preset) === modelValue }"
          :style="{ background: preset }"
          @click="selectPreset(preset)"
        />
      </div>
      <input
        class="vp-colorpicker__input"
        type="text"
        :value="modelValue"
        :disabled="disabled"
        @input="handleInput"
      />
    </div>
  </div>
</template>
