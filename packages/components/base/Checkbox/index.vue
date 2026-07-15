<script setup lang="ts">
import { computed, inject, ref, watch, onMounted } from 'vue'
import type { CheckboxProps, CheckboxEmits } from './types'
import { CHECKBOX_GROUP_INJECTION_KEY } from './types'
import './style.scss'

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  indeterminate: false
})

const emit = defineEmits<CheckboxEmits>()
const group = inject(CHECKBOX_GROUP_INJECTION_KEY, null)
const inputRef = ref<HTMLInputElement | null>(null)

const isGroupMode = computed(() => group != null && props.value !== undefined)

const isChecked = computed(() => {
  if (isGroupMode.value && group) {
    return group.modelValue.includes(props.value)
  }
  return props.modelValue
})

const isDisabled = computed(() => props.disabled || group?.disabled || false)

const rootClass = computed(() => [
  'vp-checkbox',
  { 'vp-checkbox--disabled': isDisabled.value },
  props.class
])

const syncIndeterminate = () => {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate && !isChecked.value
  }
}

onMounted(syncIndeterminate)
watch([() => props.indeterminate, isChecked], syncIndeterminate)

const handleChange = (event: Event) => {
  if (isDisabled.value) return
  const target = event.target as HTMLInputElement
  if (isGroupMode.value && group) {
    group.toggle(props.value, target.checked)
  } else {
    emit('update:modelValue', target.checked)
    emit('change', target.checked)
  }
}
</script>

<template>
  <label :class="rootClass" :style="style">
    <input
      ref="inputRef"
      class="vp-checkbox__input"
      type="checkbox"
      :checked="isChecked"
      :disabled="isDisabled"
      @change="handleChange"
    />
    <span class="vp-checkbox__mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <path v-if="indeterminate && !isChecked" d="M5 12h14" />
        <path v-else d="M5 12l5 5L19 7" />
      </svg>
    </span>
    <span v-if="label || $slots.default" class="vp-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
