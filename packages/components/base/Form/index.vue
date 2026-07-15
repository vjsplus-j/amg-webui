<script setup lang="ts">
import { provide, ref, computed } from 'vue'
import type { FormProps, FormEmits } from './types'
import { FORM_INJECTION_KEY } from './types'
import { validateRules } from './useFormValidate'
import './style.scss'

const props = withDefaults(defineProps<FormProps>(), {
  model: () => ({}),
  labelPosition: 'left'
})

const emit = defineEmits<FormEmits>()

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

async function validate(): Promise<boolean> {
  const propsToValidate = Object.keys(props.rules ?? {})
  const result: Record<string, string> = {}
  for (const prop of propsToValidate) {
    const err = await validateField(prop)
    if (err) result[prop] = err
  }
  const valid = Object.keys(result).length === 0
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
  disabled: props.disabled,
  labelWidth: props.labelWidth,
  validateField,
  registerError,
  getError
})

const rootClass = computed(() => [
  'vp-form',
  `vp-form--label-${props.labelPosition === 'top' ? 'top' : 'left'}`,
  props.class
])

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  const valid = await validate()
  if (valid) emit('submit')
}

defineExpose({ validate, validateField })
</script>

<template>
  <form :class="rootClass" :style="style" @submit="handleSubmit">
    <slot />
  </form>
</template>
