<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import { applySanitizeInput } from '@amg-webui/security'
import type { PasswordProps, PasswordEmits } from './types'
import { usePassword } from './usePassword'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'Password' })

const props = withDefaults(defineProps<PasswordProps>(), {
  modelValue: '',
  showToggle: true,
  size: 'md',
  autocomplete: 'current-password',
  sanitizeInput: true,
  telemetry: undefined
})

const emit = defineEmits<PasswordEmits>()
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
  name: () => props.name
})

const { nativeAttrs } = useNativeInputAttrs()
const { inputType, rootClass, toggle } = usePassword(props, {
  invalid: isInvalid,
  disabled: isDisabled
})

const resolvedPlaceholder = computed(
  () => props.placeholder ?? t(LocaleKeys.auth.password)
)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const next = applySanitizeInput(target.value, props.sanitizeInput, 'input')
  if (next !== target.value) target.value = next
  emit('update:modelValue', next)
  emit('input', event)
  void validateOnChange()
  trackEmit({
    component: 'Password',
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

const handleFocus = (event: FocusEvent) => emit('focus', event)
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
</script>

<template>
  <div :class="rootClass" :style="style">
    <input
      v-bind="nativeAttrs"
      :id="inputId"
      class="vp-password__input"
      :type="inputType"
      :name="resolvedName"
      :value="modelValue"
      :placeholder="resolvedPlaceholder"
      :disabled="isDisabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :autocomplete="autocomplete"
      :aria-label="ariaLabel"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <button
      v-if="showToggle"
      type="button"
      class="vp-password__toggle"
      tabindex="-1"
      :disabled="isDisabled"
      :aria-pressed="inputType === 'text'"
      :aria-label="
        inputType === 'password'
          ? t('component.login-panel.showPassword')
          : t('component.login-panel.hidePassword')
      "
      @click="toggle"
    >
      <svg
        v-if="inputType === 'password'"
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
      </svg>
    </button>
  </div>
</template>
