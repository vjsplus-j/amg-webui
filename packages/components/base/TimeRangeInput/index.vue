<script setup lang="ts">
import { computed } from 'vue'
import TimePicker from '../TimePicker/index.vue'
import type { TimeRangeInputProps, TimeRangeInputEmits, TimeRangeValue } from './types'
import './style.scss'

const props = withDefaults(defineProps<TimeRangeInputProps>(), {
  modelValue: () => ({ start: null, end: null }),
  showSeconds: true
})

const emit = defineEmits<TimeRangeInputEmits>()

const local = computed(() => props.modelValue ?? { start: null, end: null })

const toMinutes = (time: string | null | undefined): number | null => {
  if (!time) return null
  const parts = String(time).split(':').map(Number)
  return (parts[0] ?? 0) * 60 + (parts[1] ?? 0)
}

const emitValue = (next: TimeRangeValue) => {
  let start = next.start ?? null
  let end = next.end ?? null
  const s = toMinutes(start)
  const e = toMinutes(end)
  if (s != null && e != null && s > e) {
    ;[start, end] = [end, start]
  }
  const value = { start, end }
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div :class="['vp-time-range-input', props.class]" :style="style" data-component="TimeRangeInput">
    <TimePicker
      class="vp-time-range-input__field"
      :model-value="local.start"
      :disabled="disabled"
      :show-seconds="showSeconds"
      @update:model-value="(v) => emitValue({ ...local, start: v as string })"
    />
    <span class="vp-time-range-input__sep" aria-hidden="true">–</span>
    <TimePicker
      class="vp-time-range-input__field"
      :model-value="local.end"
      :disabled="disabled"
      :show-seconds="showSeconds"
      @update:model-value="(v) => emitValue({ ...local, end: v as string })"
    />
  </div>
</template>
