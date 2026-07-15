<script setup lang="ts">
import { inject, computed, watch, onMounted } from 'vue'
import type { FormItemProps, FormItemEmits } from './types'
import { FORM_INJECTION_KEY } from '../Form/types'
import './style.scss'

const props = defineProps<FormItemProps>()
const emit = defineEmits<FormItemEmits>()

const form = inject(FORM_INJECTION_KEY, null)

const error = computed(() => {
  if (!props.prop || !form) return null
  return form.getError(props.prop)
})

const labelStyle = computed(() => {
  const width = props.labelWidth ?? form?.labelWidth
  return width ? { width } : undefined
})

const rootClass = computed(() => ['vp-formitem', props.class])

const labelClass = computed(() => [
  'vp-formitem__label',
  { 'vp-formitem__label--required': props.required }
])

const validate = async () => {
  if (!props.prop || !form) return null
  const err = await form.validateField(props.prop)
  emit('validate', err)
  return err
}

onMounted(() => {
  if (props.prop && form) {
    watch(
      () => form.model[props.prop!],
      () => {
        if (error.value) validate()
      }
    )
  }
})

defineExpose({ validate })
</script>

<template>
  <div :class="rootClass" :style="style">
    <label v-if="label || $slots.label" :class="labelClass" :style="labelStyle">
      <slot name="label">{{ label }}</slot>
    </label>
    <div class="vp-formitem__content">
      <slot />
      <div v-if="error || $slots.error" class="vp-formitem__error">
        <slot name="error" :error="error">{{ error }}</slot>
      </div>
    </div>
  </div>
</template>
