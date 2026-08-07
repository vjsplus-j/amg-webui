<script setup lang="ts">
import { inject, computed, watch, onUnmounted, provide, useSlots } from 'vue'
import { createFieldId } from '@amg-webui/utils'
import { FORM_INJECTION_KEY } from '../Form/types'
import type { FormRule } from '../Form/types'
import { FORM_ITEM_INJECTION_KEY, type FormItemProps, type FormItemEmits } from './types'
import './style.scss'

defineOptions({ name: 'FormItem', inheritAttrs: false })

const props = withDefaults(defineProps<FormItemProps>(), {
  telemetry: undefined
})

const emit = defineEmits<FormItemEmits>()

const slots = useSlots()
const form = inject(FORM_INJECTION_KEY, null)
const fieldId = createFieldId('vp-form-item')
const labelId = `${fieldId}-label`
const errorId = `${fieldId}-error`

const propRef = computed(() => props.prop)

const error = computed(() => {
  if (!props.prop || !form) return null
  return form.getError(props.prop)
})

const ruleRequired = computed(() => {
  if (!props.prop || !form?.rules) return false
  const rule = form.rules[props.prop] as FormRule | FormRule[] | undefined
  if (!rule) return false
  const list = Array.isArray(rule) ? rule : [rule]
  return list.some((r) => r.required)
})

const isRequired = computed(() => props.required || ruleRequired.value)

const isDisabled = computed(() => Boolean(form?.disabled.value))

const labelStyle = computed(() => {
  const width = props.labelWidth ?? form?.labelWidth.value
  return width ? { width } : undefined
})

const rootClass = computed(() => [
  'vp-form-item',
  {
    'vp-form-item--error': Boolean(error.value),
    'vp-form-item--disabled': isDisabled.value
  },
  props.class
])

const labelClass = computed(() => [
  'vp-form-item__label',
  { 'vp-form-item__label--required': isRequired.value }
])

async function validate() {
  if (!props.prop || !form) return null
  const err = await form.validateField(props.prop)
  emit('validate', err)
  return err
}

const hasLabel = computed(() => Boolean(props.label || slots.label))

provide(FORM_ITEM_INJECTION_KEY, {
  inputId: fieldId,
  errorId,
  labelId,
  hasLabel,
  prop: propRef,
  error,
  required: isRequired,
  disabled: isDisabled,
  validate
})

let stopWatch: (() => void) | undefined
if (props.prop && form) {
  stopWatch = watch(
    () => form.model[props.prop!],
    () => {
      if (error.value) void validate()
    }
  )
}

onUnmounted(() => {
  stopWatch?.()
})

defineExpose({ validate, fieldId, clearValidate: () => form?.clearValidate(props.prop) })
</script>

<template>
  <div :class="rootClass" :style="style" data-component="FormItem">
    <label
      v-if="label || $slots.label"
      :id="labelId"
      :class="labelClass"
      :style="labelStyle"
      :for="fieldId"
    >
      <slot name="label">{{ label }}</slot>
    </label>
    <div class="vp-form-item__content">
      <div
        class="vp-form-item__control"
        role="group"
        :aria-labelledby="label || $slots.label ? labelId : undefined"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="error ? errorId : undefined"
      >
        <slot :id="fieldId" :error="error" :required="isRequired" />
      </div>
      <div
        v-if="error || $slots.error"
        :id="errorId"
        class="vp-form-item__error"
        role="alert"
      >
        <slot name="error" :error="error">{{ error }}</slot>
      </div>
    </div>
  </div>
</template>
