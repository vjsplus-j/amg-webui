<script setup lang="ts">
import { computed } from 'vue'
import type { RangeInputProps, RangeInputEmits, RangeValue } from './types'
import './style.scss'

const props = withDefaults(defineProps<RangeInputProps>(), {
  modelValue: () => ({ min: null, max: null }),
  precision: 0,
  step: 1
})

const emit = defineEmits<RangeInputEmits>()

const local = computed(() => props.modelValue ?? { min: null, max: null })

const parseNum = (raw: string): number | null => {
  if (raw.trim() === '') return null
  const n = Number(raw)
  if (Number.isNaN(n)) return null
  return props.precision > 0 ? Number(n.toFixed(props.precision)) : Math.round(n)
}

const emitValue = (next: RangeValue) => {
  let min = next.min ?? null
  let max = next.max ?? null
  if (min != null && max != null && min > max) {
    ;[min, max] = [max, min]
  }
  const value = { min, max }
  emit('update:modelValue', value)
  emit('change', value)
}

const onMinInput = (event: Event) => {
  emitValue({ ...local.value, min: parseNum((event.target as HTMLInputElement).value) })
}

const onMaxInput = (event: Event) => {
  emitValue({ ...local.value, max: parseNum((event.target as HTMLInputElement).value) })
}
</script>

<template>
  <div :class="['vp-range-input', props.class]" :style="style" data-component="RangeInput">
    <input
      class="vp-range-input__field"
      type="number"
      :value="local.min == null ? '' : local.min"
      :disabled="disabled"
      :step="step"
      @input="onMinInput"
    />
    <span class="vp-range-input__sep" aria-hidden="true">–</span>
    <input
      class="vp-range-input__field"
      type="number"
      :value="local.max == null ? '' : local.max"
      :disabled="disabled"
      :step="step"
      @input="onMaxInput"
    />
  </div>
</template>

<style scoped>
.vp-range-input__field {
  flex: 1;
  min-width: 0;
  height: var(--height-md);
  border: 1px solid var(--ds-border, var(--border-color));
  border-radius: var(--theme-input-radius, var(--border-radius-md));
  padding: 0 var(--spacing-md);
  background: var(--surface-0, var(--surface-1));
  color: var(--text-primary);
  font-size: var(--font-size-md);
}
</style>
