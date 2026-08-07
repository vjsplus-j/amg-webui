<script setup lang="ts">
import { provide, ref, computed, toRef } from 'vue'
import { trackEmit } from '@amg-webui/telemetry'
import { sanitizeModelStrings } from '@amg-webui/security'
import {
  FORM_INJECTION_KEY,
  type FormProps,
  type FormEmits,
  type FormRules
} from './types'
import { validateRules } from './useFormValidate'
import './style.scss'

defineOptions({ name: 'Form', inheritAttrs: false })

const props = withDefaults(defineProps<FormProps>(), {
  model: () => ({}),
  labelPosition: 'left',
  sanitizeOnSubmit: false,
  telemetry: undefined
})

const emit = defineEmits<FormEmits>()

const errors = ref<Record<string, string>>({})
const initialModel = ref<Record<string, unknown> | null>(null)

function cloneModel(model: Record<string, unknown>): Record<string, unknown> {
  try {
    return JSON.parse(JSON.stringify(model)) as Record<string, unknown>
  } catch {
    return { ...model }
  }
}

function snapshotModel() {
  initialModel.value = props.model ? cloneModel(props.model) : {}
}

snapshotModel()

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

function resetFields(prop?: string) {
  if (!props.model) return
  const snap = initialModel.value ?? {}
  if (prop) {
    props.model[prop] = cloneModel({ v: snap[prop] }).v
    clearValidate(prop)
    return
  }
  const next = cloneModel(snap)
  for (const key of Object.keys(props.model)) {
    if (!Object.prototype.hasOwnProperty.call(next, key)) {
      delete props.model[key]
    }
  }
  Object.assign(props.model, next)
  clearValidate()
}

async function validate(): Promise<boolean> {
  const propsToValidate = Object.keys(props.rules ?? {})
  for (const field of propsToValidate) {
    await validateField(field)
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
    return props.rules as FormRules | undefined
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

defineExpose({
  validate,
  validateField,
  clearValidate,
  resetFields
})
</script>

<template>
  <form :class="rootClass" :style="style" data-component="Form" @submit="handleSubmit">
    <slot />
  </form>
</template>
