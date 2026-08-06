<script setup lang="ts">
import { provide, ref, computed, toRef } from 'vue'
import { trackEmit } from '@amg-webui/telemetry'
import { sanitizeModelStrings } from '@amg-webui/security'
import { FORM_INJECTION_KEY } from './types'
import { validateRules } from './useFormValidate'
import './style.scss'

const props = withDefaults(
  defineProps<{
    model?: Record<string, unknown>
    rules?: Record<string, import('./types').FormRule | import('./types').FormRule[]>
    disabled?: boolean
    labelWidth?: string
    labelPosition?: 'left' | 'top'
    sanitizeOnSubmit?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    model: () => ({}),
    labelPosition: 'left',
    sanitizeOnSubmit: false,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  validate: [valid: boolean, errors: Record<string, string>]
  submit: []
}>()

const errors = ref<Record<string, string>>({})

async function validateField(prop: string): Promise<string | null> {
  const value = props.model?.[prop]
  const rule = props.rules?.[prop]
  const err = await validateRules(value, rule)
  if (err) {
    errors.value = { ...errors.value, [prop]: err }
    return err
  }
  const next = { ...errors.value }
  delete next[prop]
  errors.value = next
  return null
}

function registerError(prop: string, error: string | null) {
  if (error) {
    errors.value = { ...errors.value, [prop]: error }
  } else {
    const next = { ...errors.value }
    delete next[prop]
    errors.value = next
  }
}

function getError(prop: string) {
  return errors.value[prop] ?? null
}

function clearValidate(prop?: string) {
  if (prop) {
    const next = { ...errors.value }
    delete next[prop]
    errors.value = next
    return
  }
  errors.value = {}
}

async function validate(): Promise<boolean> {
  const propsToValidate = Object.keys(props.rules ?? {})
  for (const prop of propsToValidate) {
    await validateField(prop)
  }
  const valid = Object.keys(errors.value).length === 0
  trackEmit({
    component: 'Form',
    type: 'validate',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { valid }
  })
  emit('validate', valid, { ...errors.value })
  return valid
}

provide(FORM_INJECTION_KEY, {
  get model() {
    return props.model ?? {}
  },
  get rules() {
    return props.rules
  },
  disabled: toRef(props, 'disabled'),
  labelWidth: toRef(props, 'labelWidth'),
  labelPosition: toRef(props, 'labelPosition'),
  validateField,
  registerError,
  getError,
  clearValidate
})

const rootClass = computed(() => [
  'vp-form',
  `vp-form--label-${props.labelPosition === 'top' ? 'top' : 'left'}`,
  { 'vp-form--disabled': props.disabled },
  props.class
])

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  const valid = await validate()
  if (valid) {
    if (props.sanitizeOnSubmit && props.model) {
      const cleaned = sanitizeModelStrings(props.model)
      Object.assign(props.model, cleaned)
    }
    trackEmit({
      component: 'Form',
      type: 'submit',
      trackId: props.trackId,
      telemetry: props.telemetry
    })
    emit('submit')
  }
}

defineExpose({ validate, validateField, clearValidate })
</script>

<template>
  <form :class="rootClass" :style="style" @submit="handleSubmit">
    <slot />
  </form>
</template>
