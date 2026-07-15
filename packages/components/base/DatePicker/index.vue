<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale, usePopover } from '@amg-webui/hooks'
import {
  getCalendarDays,
  getMonthYearLabel,
  getWeekdayLabels,
  parseISODate,
  sameDate,
  toISODate,
  formatWithIntl
} from '@amg-webui/utils'
import type { DatePickerProps, DatePickerEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: null,
  valueFormat: 'iso'
})

const emit = defineEmits<DatePickerEmits>()

const { locale } = useLocale()
const { isOpen, triggerRef, panelRef, toggle, close } = usePopover()

const viewDate = ref(new Date())

const selectedDate = computed(() => {
  if (!props.modelValue) return null
  if (props.modelValue instanceof Date) return props.modelValue
  return parseISODate(String(props.modelValue))
})

watch(
  selectedDate,
  (val) => {
    if (val) viewDate.value = new Date(val)
  },
  { immediate: true }
)

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
  if (!selectedDate.value) return ''
  void locale.value
  return formatWithIntl(selectedDate.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const isPlaceholder = computed(() => !props.modelValue && !!props.placeholder)

const emitValue = (date: Date) => {
  const value = props.valueFormat === 'date' ? date : toISODate(date)
  emit('update:modelValue', value)
  emit('change', value)
  close()
}

const prevMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}

const handleTriggerClick = () => {
  if (props.disabled) return
  toggle()
}

const selectDay = (day: Date | null) => {
  if (!day) return
  emitValue(day)
}
</script>

<template>
  <div :class="['vp-datepicker', props.class]" :style="style">
    <button
      ref="triggerRef"
      type="button"
      class="vp-datepicker__trigger"
      :disabled="disabled"
      @click="handleTriggerClick"
    >
      <span
        :class="['vp-datepicker__label', { 'vp-datepicker__label--placeholder': isPlaceholder }]"
      >
        {{ isPlaceholder ? placeholder : displayLabel }}
      </span>
      <span aria-hidden="true">v</span>
    </button>

    <div v-if="isOpen" ref="panelRef" class="vp-datepicker__panel">
      <div class="vp-datepicker__header">
        <span>{{ monthLabel }}</span>
        <div class="vp-datepicker__nav">
          <button type="button" class="vp-datepicker__nav-btn" @click="prevMonth">‹</button>
          <button type="button" class="vp-datepicker__nav-btn" @click="nextMonth">›</button>
        </div>
      </div>

      <div class="vp-datepicker__weekdays">
        <span v-for="(wd, i) in weekdayLabels" :key="i" class="vp-datepicker__weekday">{{ wd }}</span>
      </div>

      <div v-for="(week, wi) in weeks" :key="wi" class="vp-datepicker__grid">
        <button
          v-for="(day, di) in week"
          :key="di"
          type="button"
          :class="[
            'vp-datepicker__day',
            {
              'vp-datepicker__day--selected': sameDate(day, selectedDate),
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
  </div>
</template>
