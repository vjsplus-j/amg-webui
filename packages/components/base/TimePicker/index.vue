<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePopover } from '@amg-webui/hooks'
import Icon from '../Icon/index.vue'
import { toTimeString } from '@amg-webui/utils'
import type { TimePickerProps, TimePickerEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<TimePickerProps>(), {
  modelValue: null,
  showSeconds: true,
  valueFormat: 'time',
  minuteStep: 1,
  secondStep: 1,
  clearable: false,
  readonly: false
})

const emit = defineEmits<TimePickerEmits>()

const { isOpen, triggerRef, panelRef, toggle, close } = usePopover()

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = computed(() => Array.from({ length: Math.ceil(60 / Math.max(1, props.minuteStep)) }, (_, i) => i * Math.max(1, props.minuteStep)))
const seconds = computed(() => Array.from({ length: Math.ceil(60 / Math.max(1, props.secondStep)) }, (_, i) => i * Math.max(1, props.secondStep)))

const selectedHour = ref(0)
const selectedMinute = ref(0)
const selectedSecond = ref(0)

const parseValue = () => {
  if (!props.modelValue) return
  let h = 0
  let m = 0
  let s = 0
  if (props.modelValue instanceof Date) {
    h = props.modelValue.getHours()
    m = props.modelValue.getMinutes()
    s = props.modelValue.getSeconds()
  } else {
    const parts = String(props.modelValue).split(':').map(Number)
    h = parts[0] ?? 0
    m = parts[1] ?? 0
    s = parts[2] ?? 0
  }
  selectedHour.value = h
  selectedMinute.value = m
  selectedSecond.value = s
}

watch(() => props.modelValue, parseValue, { immediate: true })
watch(isOpen, (open) => emit('open-change', open))

const displayLabel = computed(() => {
  if (!props.modelValue) return ''
  const d = new Date()
  d.setHours(selectedHour.value, selectedMinute.value, selectedSecond.value, 0)
  return toTimeString(d, props.showSeconds)
})

const isPlaceholder = computed(() => !props.modelValue && !!props.placeholder)

const emitValue = () => {
  const d = new Date()
  d.setHours(selectedHour.value, selectedMinute.value, selectedSecond.value, 0)
  const value = props.valueFormat === 'date' ? d : toTimeString(d, props.showSeconds)
  emit('update:modelValue', value)
  emit('change', value)
}

const handleTriggerClick = () => {
  if (props.disabled || props.readonly) return
  toggle()
}

const selectHour = (h: number) => {
  selectedHour.value = h
  emitValue()
}

const selectMinute = (m: number) => {
  selectedMinute.value = m
  emitValue()
}

const selectSecond = (s: number) => {
  selectedSecond.value = s
  emitValue()
}

const pad = (n: number) => String(n).padStart(2, '0')

function clearValue(event: MouseEvent) {
  event.stopPropagation()
  if (props.disabled || props.readonly) return
  emit('update:modelValue', null)
  emit('change', null)
  emit('clear')
  close()
}
</script>

<template>
  <div :class="['vp-timepicker', { 'vp-timepicker--invalid': invalid, 'vp-timepicker--disabled': disabled }, props.class]" :style="style" data-component="TimePicker">
    <button
      ref="triggerRef"
      type="button"
      class="vp-timepicker__trigger"
      :disabled="disabled"
      :aria-label="ariaLabel"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-invalid="invalid || undefined"
      @click="handleTriggerClick"
    >
      <span
        :class="['vp-timepicker__label', { 'vp-timepicker__label--placeholder': isPlaceholder }]"
      >
        {{ isPlaceholder ? placeholder : displayLabel }}
      </span>
      <Icon name="Clock" size="sm" aria-hidden="true" />
    </button>
    <button v-if="clearable && modelValue" type="button" class="vp-timepicker__clear" :disabled="disabled || readonly" @click="clearValue"><Icon name="X" size="sm" /></button>

    <div v-if="isOpen" ref="panelRef" class="vp-timepicker__panel" role="listbox">
      <div class="vp-timepicker__columns">
        <div class="vp-timepicker__column">
          <button
            v-for="h in hours"
            :key="h"
            type="button"
            :class="['vp-timepicker__item', { 'vp-timepicker__item--selected': h === selectedHour }]"
            @click="selectHour(h)"
          >
            {{ pad(h) }}
          </button>
        </div>
        <div class="vp-timepicker__column">
          <button
            v-for="m in minutes"
            :key="m"
            type="button"
            :class="['vp-timepicker__item', { 'vp-timepicker__item--selected': m === selectedMinute }]"
            @click="selectMinute(m)"
          >
            {{ pad(m) }}
          </button>
        </div>
        <div v-if="showSeconds" class="vp-timepicker__column">
          <button
            v-for="s in seconds"
            :key="s"
            type="button"
            :class="['vp-timepicker__item', { 'vp-timepicker__item--selected': s === selectedSecond }]"
            @click="selectSecond(s)"
          >
            {{ pad(s) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
