<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useLocale, usePopover } from '@amg-webui/hooks'
import {
  getCalendarDays,
  getFloatingPanelStyle,
  getMonthYearLabel,
  getWeekdayLabels,
  parseISODate,
  resolveKeyboardNavAction,
  sameDate,
  toISODate,
  toTimeString,
  formatWithIntl
} from '@amg-webui/utils'
import type { DateTimePickerProps, DateTimePickerEmits } from './types'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'DateTimePicker' })

const props = withDefaults(defineProps<DateTimePickerProps>(), {
  modelValue: null,
  showSeconds: true,
  valueFormat: 'iso'
})

const emit = defineEmits<DateTimePickerEmits>()

const {
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  validateOnBlur,
  validateOnChange
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
  name: () => props.name
})

const { nativeAttrs } = useNativeInputAttrs()

const { locale } = useLocale()
const { isOpen, triggerRef, panelRef, toggle, close } = usePopover()
const floatingPanelStyle = ref<Record<string, string>>({})

const panelMergedStyle = computed(() => ({
  ...floatingPanelStyle.value
}))

function syncFloating() {
  const trigger = triggerRef.value
  if (!isOpen.value || !trigger) {
    floatingPanelStyle.value = {}
    return
  }
  const { style } = getFloatingPanelStyle(trigger, panelRef.value, {
    placement: 'bottom-start',
    matchTriggerWidth: true,
    offset: 4
  })
  floatingPanelStyle.value = style
}

const viewDate = ref(new Date())
const selectedHour = ref(0)
const selectedMinute = ref(0)
const selectedSecond = ref(0)
const pickedDate = ref<Date | null>(null)

const syncFromModel = () => {
  if (!props.modelValue) {
    pickedDate.value = null
    return
  }
  let d: Date | null = null
  if (props.modelValue instanceof Date) {
    d = props.modelValue
  } else {
    const str = String(props.modelValue)
    const [datePart, timePart] = str.split(/[T ]/)
    d = parseISODate(datePart)
    if (d && timePart) {
      const [h, m, s] = timePart.split(':').map(Number)
      d.setHours(h ?? 0, m ?? 0, s ?? 0, 0)
    }
  }
  if (d) {
    pickedDate.value = d
    viewDate.value = new Date(d)
    selectedHour.value = d.getHours()
    selectedMinute.value = d.getMinutes()
    selectedSecond.value = d.getSeconds()
  }
}

watch(() => props.modelValue, syncFromModel, { immediate: true })

const weekdayLabels = computed(() => {
  void locale.value
  return getWeekdayLabels()
})

const monthLabel = computed(() => {
  void locale.value
  return getMonthYearLabel(viewDate.value)
})

const weeks = computed(() => {
  void locale.value
  return getCalendarDays(viewDate.value.getFullYear(), viewDate.value.getMonth())
})

const displayLabel = computed(() => {
  if (!pickedDate.value) return ''
  void locale.value
  const dateStr = formatWithIntl(pickedDate.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  return `${dateStr} ${toTimeString(pickedDate.value, props.showSeconds)}`
})

const isPlaceholder = computed(() => !props.modelValue && !!props.placeholder)

const emitValue = () => {
  if (!pickedDate.value) return
  const d = new Date(pickedDate.value)
  d.setHours(selectedHour.value, selectedMinute.value, selectedSecond.value, 0)
  const value =
    props.valueFormat === 'date'
      ? d
      : `${toISODate(d)} ${toTimeString(d, props.showSeconds)}`
  emit('update:modelValue', value)
  emit('change', value)
  void validateOnChange()
}

const prevMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}

const handleTriggerClick = () => {
  if (isDisabled.value) return
  toggle()
}

const handleTriggerBlur = () => {
  void validateOnBlur()
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return
  const action = resolveKeyboardNavAction(event, { orientation: 'vertical' })
  if (!isOpen.value) {
    if (action === 'next' || action === 'select' || event.key === 'ArrowDown') {
      event.preventDefault()
      toggle()
    }
    return
  }
  if (action === 'close') {
    event.preventDefault()
    close()
    floatingPanelStyle.value = {}
    triggerRef.value?.focus?.()
  }
}

watch(isOpen, (open) => {
  if (open) nextTick(syncFloating)
  else floatingPanelStyle.value = {}
})

const selectDay = (day: Date | null) => {
  if (!day) return
  pickedDate.value = day
  emitValue()
}

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 60 }, (_, i) => i)
const seconds = Array.from({ length: 60 }, (_, i) => i)
const pad = (n: number) => String(n).padStart(2, '0')

const selectHour = (h: number) => {
  selectedHour.value = h
  if (!pickedDate.value) pickedDate.value = new Date()
  emitValue()
}

const selectMinute = (m: number) => {
  selectedMinute.value = m
  if (!pickedDate.value) pickedDate.value = new Date()
  emitValue()
}

const selectSecond = (s: number) => {
  selectedSecond.value = s
  if (!pickedDate.value) pickedDate.value = new Date()
  emitValue()
}
</script>

<template>
  <div :class="['vp-datetimepicker', props.class]" :style="style">
    <button
      ref="triggerRef"
      v-bind="nativeAttrs"
      :id="inputId"
      type="button"
      class="vp-datetimepicker__trigger"
      role="combobox"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      :disabled="isDisabled"
      @click="handleTriggerClick"
      @blur="handleTriggerBlur"
      @keydown="handleTriggerKeydown"
    >
      <span
        :class="[
          'vp-datetimepicker__label',
          { 'vp-datetimepicker__label--placeholder': isPlaceholder }
        ]"
      >
        {{ isPlaceholder ? placeholder : displayLabel }}
      </span>
      <span aria-hidden="true">v</span>
    </button>

    <div
      v-if="isOpen"
      ref="panelRef"
      class="vp-datetimepicker__panel"
      :style="panelMergedStyle"
      @keydown="handleTriggerKeydown"
    >
      <div class="vp-datetimepicker__body">
        <div class="vp-datetimepicker__date">
          <div class="vp-datepicker__header">
            <span>{{ monthLabel }}</span>
            <div class="vp-datepicker__nav">
              <button type="button" class="vp-datepicker__nav-btn" @click="prevMonth">‹</button>
              <button type="button" class="vp-datepicker__nav-btn" @click="nextMonth">›</button>
            </div>
          </div>
          <div class="vp-datepicker__weekdays">
            <span v-for="(wd, i) in weekdayLabels" :key="i" class="vp-datepicker__weekday">{{
              wd
            }}</span>
          </div>
          <div v-for="(week, wi) in weeks" :key="wi" class="vp-datepicker__grid">
            <button
              v-for="(day, di) in week"
              :key="di"
              type="button"
              :class="[
                'vp-datepicker__day',
                {
                  'vp-datepicker__day--selected': sameDate(day, pickedDate),
                  'vp-datepicker__day--empty': !day
                }
              ]"
              :disabled="!day"
              @click="selectDay(day)"
            >
              {{ day ? day.getDate() : '' }}
            </button>
          </div>
        </div>
        <div class="vp-datetimepicker__time">
          <div class="vp-timepicker__columns">
            <div class="vp-timepicker__column">
              <button
                v-for="h in hours"
                :key="h"
                type="button"
                :class="[
                  'vp-timepicker__item',
                  { 'vp-timepicker__item--selected': h === selectedHour }
                ]"
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
                :class="[
                  'vp-timepicker__item',
                  { 'vp-timepicker__item--selected': m === selectedMinute }
                ]"
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
                :class="[
                  'vp-timepicker__item',
                  { 'vp-timepicker__item--selected': s === selectedSecond }
                ]"
                @click="selectSecond(s)"
              >
                {{ pad(s) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
