<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import TimePicker from '../TimePicker/index.vue'
import Button from '@amg-webui/core/Button/index.vue'
import { useFormItem } from '../FormItem/useFormItem'
import type { TimeRangeInputProps, TimeRangeInputEmits, TimeRangeValue } from './types'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'TimeRangeInput' })

const props = withDefaults(defineProps<TimeRangeInputProps>(), {
  modelValue: () => ({ start: null, end: null }),
  showSeconds: true,
  clearable: false,
  telemetry: undefined
})

const emit = defineEmits<TimeRangeInputEmits>()
const { t } = useLocale()

const {
  inputId,
  isDisabled,
  isInvalid: formInvalid,
  isRequired,
  ariaDescribedby,
  validateOnChange
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
  name: () => props.name
})

const local = computed(() => props.modelValue ?? { start: null, end: null })

const toMinutes = (time: string | null | undefined): number | null => {
  if (!time) return null
  const parts = String(time).split(':').map(Number)
  return (parts[0] ?? 0) * 60 + (parts[1] ?? 0)
}

const rangeInvalid = computed(() => {
  const s = toMinutes(local.value.start)
  const e = toMinutes(local.value.end)
  return s != null && e != null && s > e
})

const isInvalid = computed(() => formInvalid.value || rangeInvalid.value)

const hasValue = computed(() => !!local.value.start || !!local.value.end)

const emitValue = (next: TimeRangeValue) => {
  const value = { start: next.start ?? null, end: next.end ?? null }
  emit('update:modelValue', value)
  emit('change', value)
  void validateOnChange()
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
    :id="inputId"
    :class="[
      'vp-time-range-input',
      props.class,
      {
        'vp-time-range-input--invalid': isInvalid,
        'vp-time-range-input--disabled': isDisabled
      }
    ]"
    :style="style"
    data-component="TimeRangeInput"
    role="group"
    :aria-label="ariaLabel ?? t(LocaleKeys.component.timeRangeInput.aria)"
    :aria-invalid="isInvalid || undefined"
    :aria-required="isRequired || undefined"
    :aria-describedby="ariaDescribedby"
  >
    <div class="vp-time-range-input__fields">
      <TimePicker
        class="vp-time-range-input__field"
        :model-value="local.start"
        :disabled="isDisabled"
        :show-seconds="showSeconds"
        :invalid="isInvalid"
        :placeholder="t(LocaleKeys.component.timeRangeInput.start)"
        :aria-label="t(LocaleKeys.component.timeRangeInput.start)"
        skip-form-item
        @update:model-value="(v) => emitValue({ ...local, start: v as string })"
      />
      <span class="vp-time-range-input__sep" aria-hidden="true">–</span>
      <TimePicker
        class="vp-time-range-input__field"
        :model-value="local.end"
        :disabled="isDisabled"
        :show-seconds="showSeconds"
        :invalid="isInvalid"
        :placeholder="t(LocaleKeys.component.timeRangeInput.end)"
        :aria-label="t(LocaleKeys.component.timeRangeInput.end)"
        skip-form-item
        @update:model-value="(v) => emitValue({ ...local, end: v as string })"
      />
    </div>
    <Button
      v-if="clearable && hasValue"
      class="vp-time-range-input__clear"
      variant="text"
      size="sm"
      :disabled="isDisabled"
      :label="t(LocaleKeys.component.timeRangeInput.clear)"
      @click="clearRange"
    />
  </div>
</template>
