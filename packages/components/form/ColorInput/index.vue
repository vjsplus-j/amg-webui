<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import InputText from '../InputText/index.vue'
import ColorPicker from '../ColorPicker/index.vue'
import { useFormItem } from '../FormItem/useFormItem'
import type { ColorInputProps, ColorInputEmits } from './types'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'ColorInput' })

const props = withDefaults(defineProps<ColorInputProps>(), {
  modelValue: '',
  size: 'md',
  telemetry: undefined
})

const emit = defineEmits<ColorInputEmits>()
const { t } = useLocale()

const {
  inputId,
  isDisabled,
  isInvalid: formInvalid,
  isRequired,
  ariaDescribedby,
  validateOnChange,
  validateOnBlur
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
  name: () => props.name
})

const nativeRef = ref<HTMLInputElement | null>(null)

const isValidHex = (val: string) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)

const hexInvalid = computed(() => !!props.modelValue && !isValidHex(props.modelValue))
const invalid = computed(() => formInvalid.value || hexInvalid.value)

const swatchColor = computed(() =>
  isValidHex(props.modelValue) ? props.modelValue : 'var(--surface-2)'
)

const nativeValue = computed(() =>
  isValidHex(props.modelValue) ? props.modelValue : '#000000'
)

const rootClass = computed(() => [
  'vp-color-input',
  `vp-color-input--${props.size}`,
  props.class,
  {
    'vp-color-input--invalid': invalid.value,
    'vp-color-input--disabled': isDisabled.value
  }
])

const placeholderText = computed(
  () => props.placeholder ?? t(LocaleKeys.component.colorInput.placeholder)
)

const emitValue = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
  void validateOnChange()
  trackEmit({
    component: 'ColorInput',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value }
  })
}

const onTextInput = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    emitValue('')
    return
  }
  emitValue(trimmed.startsWith('#') ? trimmed : `#${trimmed}`)
}

const onNativeInput = (event: Event) => {
  emitValue((event.target as HTMLInputElement).value)
}

const openNativePicker = () => {
  if (isDisabled.value) return
  nativeRef.value?.click()
}
</script>

<template>
  <div
    :id="inputId"
    :class="rootClass"
    :style="style"
    role="group"
    :aria-label="t(LocaleKeys.component.colorInput.aria)"
    :aria-invalid="invalid || undefined"
    :aria-required="isRequired || undefined"
    :aria-describedby="ariaDescribedby"
    data-component="ColorInput"
  >
    <button
      type="button"
      class="vp-color-input__swatch-btn"
      :disabled="isDisabled"
      :aria-label="t(LocaleKeys.component.colorInput.pickColor)"
      @click="openNativePicker"
      @blur="validateOnBlur"
    >
      <span class="vp-color-input__swatch" :style="{ background: swatchColor }" aria-hidden="true" />
    </button>
    <input
      ref="nativeRef"
      class="vp-color-input__native"
      type="color"
      :value="nativeValue"
      :disabled="isDisabled"
      tabindex="-1"
      aria-hidden="true"
      @input="onNativeInput"
    />
    <InputText
      class="vp-color-input__text"
      :model-value="modelValue"
      :placeholder="placeholderText"
      :disabled="isDisabled"
      :size="size"
      :invalid="invalid"
      skip-form-item
      @update:model-value="onTextInput"
    />
    <ColorPicker
      class="vp-color-input__picker"
      :model-value="isValidHex(modelValue) ? modelValue : ''"
      :disabled="isDisabled"
      skip-form-item
      @update:model-value="emitValue"
    />
    <span v-if="hexInvalid" class="vp-color-input__hint" role="alert">
      {{ t(LocaleKeys.component.colorInput.invalidHex) }}
    </span>
  </div>
</template>
