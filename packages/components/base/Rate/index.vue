<script setup lang="ts">
import { computed } from 'vue'
import type { RateProps, RateEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<RateProps>(), {
  modelValue: 0,
  max: 5,
  allowHalf: false,
  clearable: false
})

const emit = defineEmits<RateEmits>()

const stars = computed(() => Array.from({ length: props.max ?? 5 }, (_, i) => i + 1))

const rootClass = computed(() => [
  'vp-rate',
  { 'vp-rate--disabled': props.disabled },
  props.class
])

const isActive = (index: number) => (props.modelValue ?? 0) >= index
const isHalf = (index: number) =>
  props.allowHalf && (props.modelValue ?? 0) >= index - 0.5 && (props.modelValue ?? 0) < index

const setValue = (value: number) => {
  if (props.disabled) return
  const next = props.clearable && value === props.modelValue ? 0 : value
  emit('update:modelValue', next)
  emit('change', next)
}

const handleClick = (index: number, event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const half = props.allowHalf && event.clientX - rect.left < rect.width / 2
  setValue(half ? index - 0.5 : index)
}
</script>

<template>
  <div :class="rootClass" :style="style" role="slider" :aria-valuenow="modelValue" :aria-valuemax="max">
    <button
      v-for="index in stars"
      :key="index"
      type="button"
      class="vp-rate__item"
      :class="{ 'vp-rate__item--active': isActive(index) }"
      :disabled="disabled"
      @click="handleClick(index, $event)"
    >
      <svg class="vp-rate__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
      <span v-if="isHalf(index)" class="vp-rate__half" aria-hidden="true">
        <svg class="vp-rate__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      </span>
    </button>
  </div>
</template>
