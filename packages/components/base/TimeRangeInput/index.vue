<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import TimePicker from '../TimePicker/index.vue'
import Button from '../Button/index.vue'
import type { TimeRangeInputProps, TimeRangeInputEmits, TimeRangeValue } from './types'
import './style.scss'

const props = withDefaults(defineProps<TimeRangeInputProps>(), {
  modelValue: () => ({ start: null, end: null }),
  showSeconds: true,
  clearable: false,
  telemetry: undefined
})

const emit = defineEmits<TimeRangeInputEmits>()
const { t } = useLocale()

const local = computed(() => props.modelValue ?? { start: null, end: null })

const toMinutes = (time: string | null | undefined): number | null => {
  if (!time) return null
  const parts = String(time).split(':').map(Number)
  return (parts[0] ?? 0) * 60 + (parts[1] ?? 0)
}

const isInvalid = computed(() => {
  const s = toMinutes(local.value.start)
  const e = toMinutes(local.value.end)
  return s != null && e != null && s > e
})

const hasValue = computed(() => !!local.value.start || !!local.value.end)

const emitValue = (next: TimeRangeValue) => {
  const value = { start: next.start ?? null, end: next.end ?? null }
  emit('update:modelValue', value)
  emit('change', value)
  trackEmit({
    component: 'TimeRangeInput',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: value
  })
}

const clearRange = () => {
  emitValue({ start: null, end: null })
  emit('clear')
  trackEmit({
    component: 'TimeRangeInput',
    type: 'clear',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
}
</script>

<template>
  <div
    :class="[
      'vp-time-range-input',
      props.class,
      {
        'vp-time-range-input--invalid': isInvalid,
        'vp-time-range-input--disabled': disabled
      }
    ]"
    :style="style"
    data-component="TimeRangeInput"
  >
    <div class="vp-time-range-input__fields">
      <TimePicker
        class="vp-time-range-input__field"
        :model-value="local.start"
        :disabled="disabled"
        :show-seconds="showSeconds"
        :placeholder="t(LocaleKeys.component.timeRangeInput.start)"
        @update:model-value="(v) => emitValue({ ...local, start: v as string })"
      />
      <span class="vp-time-range-input__sep" aria-hidden="true">–</span>
      <TimePicker
        class="vp-time-range-input__field"
        :model-value="local.end"
        :disabled="disabled"
        :show-seconds="showSeconds"
        :placeholder="t(LocaleKeys.component.timeRangeInput.end)"
        @update:model-value="(v) => emitValue({ ...local, end: v as string })"
      />
      <Button
        v-if="clearable && hasValue"
        class="vp-time-range-input__clear"
        variant="text"
        size="sm"
        :label="t(LocaleKeys.component.timeRangeInput.clear)"
        :disabled="disabled"
        @click="clearRange"
      />
    </div>
    <p v-if="isInvalid" class="vp-time-range-input__hint" role="alert">
      {{ t(LocaleKeys.component.timeRangeInput.invalidRange) }}
    </p>
  </div>
</template>
