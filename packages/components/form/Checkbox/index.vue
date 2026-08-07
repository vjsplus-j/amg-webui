<script setup lang="ts">
import { computed, inject, ref, watch, onMounted } from 'vue'
import { trackEmit } from '@amg-webui/telemetry'
import type { CheckboxProps, CheckboxEmits } from './types'
import { CHECKBOX_GROUP_INJECTION_KEY } from './types'
import { useCheckbox } from './useCheckbox'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'Checkbox' })

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  indeterminate: false,
  telemetry: undefined,
  size: undefined,
  skipFormItem: false
})

const emit = defineEmits<CheckboxEmits>()
const group = inject(CHECKBOX_GROUP_INJECTION_KEY, null)
const inputRef = ref<HTMLInputElement | null>(null)

const {
  inputId,
  isDisabled: formDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  name: resolvedName,
  validateOnChange
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
  name: () => props.name,
  skip: () => props.skipFormItem
})

const { nativeAttrs } = useNativeInputAttrs()

const checkboxSource = computed(() => ({
  modelValue: props.modelValue,
  value: props.value,
  disabled: formDisabled.value,
  size: props.size,
  indeterminate: props.indeterminate,
  class: props.class,
  group
}))

const { isGroupMode, isChecked, isDisabled, showIndeterminate, rootClass } =
  useCheckbox(checkboxSource)

const syncIndeterminate = () => {
  if (inputRef.value) {
    inputRef.value.indeterminate = showIndeterminate.value
  }
}

onMounted(syncIndeterminate)
watch([showIndeterminate, isChecked], syncIndeterminate)

const handleChange = (event: Event) => {
  if (isDisabled.value) return
  const target = event.target as HTMLInputElement
  if (isGroupMode.value && group) {
    group.toggle(props.value, target.checked)
  } else {
    emit('update:modelValue', target.checked)
    emit('change', target.checked)
  }
  void validateOnChange()
  trackEmit({
    component: 'Checkbox',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value: isGroupMode.value ? props.value : target.checked, checked: target.checked }
  })
}
</script>

<template>
  <label :class="rootClass" :style="style">
    <input
      ref="inputRef"
      v-bind="nativeAttrs"
      :id="inputId"
      class="vp-checkbox__input"
      type="checkbox"
      :name="resolvedName"
      :checked="isChecked"
      :disabled="isDisabled"
      :aria-checked="showIndeterminate ? 'mixed' : isChecked"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      @change="handleChange"
    />
    <span class="vp-checkbox__mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <path v-if="showIndeterminate" d="M5 12h14" />
        <path v-else d="M5 12l5 5L19 7" />
      </svg>
    </span>
    <span v-if="label || $slots.default" class="vp-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
