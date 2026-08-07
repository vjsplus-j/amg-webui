<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useLocale, usePopover } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import {
  cssVarToHex,
  getFloatingPanelStyle,
  moveRovingIndex,
  resolveKeyboardNavAction
} from '@amg-webui/utils'
import type { ColorPickerProps, ColorPickerEmits } from './types'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'ColorPicker' })

const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: '',
  skipFormItem: false,
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
const { t } = useLocale()

const {
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
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

const { isOpen, triggerRef, panelRef, toggle, close } = usePopover()
const focusIndex = ref(0)
const floatingPanelStyle = ref<Record<string, string>>({})

const displayColor = computed(() => props.modelValue || 'var(--surface-2)')
const panelMergedStyle = computed(() => ({
  ...floatingPanelStyle.value
}))

function syncFloating() {
  const trigger = triggerRef.value
  if (!isOpen.value || !trigger) {
    floatingPanelStyle.value = {}
    return
  }
  const { style } = getFloatingPanelStyle(trigger, panelRef.value, {
    placement: 'bottom-start',
    matchTriggerWidth: true,
    offset: 4
  })
  floatingPanelStyle.value = style
}

const handleTriggerClick = () => {
  if (isDisabled.value) return
  toggle()
}

const handleTriggerBlur = () => {
  void validateOnBlur()
}

const emitValue = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
  void validateOnChange()
}

const selectPreset = (preset: string) => {
  emitValue(cssVarToHex(preset))
  close()
  floatingPanelStyle.value = {}
}

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emitValue(value)
}

function commitFocused() {
  const preset = props.presets?.[focusIndex.value]
  if (!preset) return
  selectPreset(preset)
}

function handlePanelKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return
  const action = resolveKeyboardNavAction(event, { orientation: 'vertical' })
  if (action === 'none') return
  event.preventDefault()
  if (action === 'close') {
    close()
    floatingPanelStyle.value = {}
    triggerRef.value?.focus?.()
    return
  }
  const count = props.presets?.length ?? 0
  if (
    action === 'next' ||
    action === 'prev' ||
    action === 'first' ||
    action === 'last'
  ) {
    focusIndex.value = moveRovingIndex(focusIndex.value, action, count, true)
    return
  }
  if (action === 'select') commitFocused()
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return
  const action = resolveKeyboardNavAction(event, { orientation: 'vertical' })
  if (!isOpen.value) {
    if (action === 'next' || action === 'select' || event.key === 'ArrowDown') {
      event.preventDefault()
      toggle()
      focusIndex.value = 0
    }
    return
  }
  handlePanelKeydown(event)
}

watch(isOpen, (open) => {
  if (open) {
    focusIndex.value = 0
    nextTick(syncFloating)
  } else {
    floatingPanelStyle.value = {}
  }
})
</script>

<template>
  <div :class="['vp-colorpicker', props.class]" :style="style">
    <button
      ref="triggerRef"
      v-bind="nativeAttrs"
      :id="inputId"
      type="button"
      class="vp-colorpicker__trigger"
      role="combobox"
      :aria-label="t(LocaleKeys.component.colorInput.pickColor)"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      :disabled="isDisabled"
      @click="handleTriggerClick"
      @blur="handleTriggerBlur"
      @keydown="handleTriggerKeydown"
    >
      <span class="vp-colorpicker__swatch" :style="{ background: displayColor }" />
      <span class="vp-colorpicker__value">{{ modelValue || '' }}</span>
    </button>

    <div
      v-if="isOpen"
      ref="panelRef"
      class="vp-colorpicker__panel"
      :style="panelMergedStyle"
      @keydown="handlePanelKeydown"
    >
      <div class="vp-colorpicker__presets" role="listbox">
        <button
          v-for="(preset, index) in presets"
          :key="index"
          type="button"
          class="vp-colorpicker__preset"
          :class="{
            'vp-colorpicker__preset--active': cssVarToHex(preset) === modelValue,
            'vp-colorpicker__preset--focused': index === focusIndex
          }"
          :style="{ background: preset }"
          :aria-label="t(LocaleKeys.component.colorInput.pickColor)"
          @click="selectPreset(preset)"
        />
      </div>
      <input
        class="vp-colorpicker__input"
        type="text"
        :value="modelValue"
        :disabled="isDisabled"
        :aria-label="t(LocaleKeys.component.colorInput.placeholder)"
        @input="handleInput"
      />
    </div>
  </div>
</template>
