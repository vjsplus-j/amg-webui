<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import {
  formatWithIntl,
  moveRovingIndex,
  resolveKeyboardNavAction
} from '@amg-webui/utils'
import type { WeekPickerProps, WeekPickerEmits } from './types'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'WeekPicker' })

const props = withDefaults(defineProps<WeekPickerProps>(), {
  modelValue: null,
  minYear: 2000,
  maxYear: 2100
})

const emit = defineEmits<WeekPickerEmits>()
const { locale, t } = useLocale()

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
  invalid: () => props.invalid
})

const { nativeAttrs } = useNativeInputAttrs()

const viewYear = ref(new Date().getFullYear())
const focusWeek = ref(1)

function getISOWeeksInYear(year: number): number {
  const d = new Date(year, 11, 31)
  const week = getISOWeek(d)
  return week === 1 ? 52 : week
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function getWeekStart(year: number, week: number): Date {
  const jan4 = new Date(year, 0, 4)
  const day = jan4.getDay() || 7
  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - day + 1 + (week - 1) * 7)
  return monday
}

const parsed = computed(() => {
  const raw = props.modelValue
  if (!raw) return null
  const match = /^(\d{4})-W(\d{1,2})$/.exec(String(raw))
  if (!match) return null
  return { year: Number(match[1]), week: Number(match[2]) }
})

watch(
  parsed,
  (val) => {
    if (val) viewYear.value = val.year
  },
  { immediate: true }
)

const weeksInYear = computed(() => getISOWeeksInYear(viewYear.value))

const weekOptions = computed(() => {
  void locale.value
  return Array.from({ length: weeksInYear.value }, (_, i) => {
    const week = i + 1
    const start = getWeekStart(viewYear.value, week)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    const range = `${formatWithIntl(start, { month: 'short', day: 'numeric' })} –${formatWithIntl(end, { month: 'short', day: 'numeric' })}`
    return { week, range }
  })
})

const displayLabel = computed(() => {
  if (!parsed.value) return ''
  const { year, week } = parsed.value
  const start = getWeekStart(year, week)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  void locale.value
  return `${year}-W${String(week).padStart(2, '0')} · ${formatWithIntl(start, { month: 'short', day: 'numeric' })} –${formatWithIntl(end, { month: 'short', day: 'numeric' })}`
})

const selectWeek = (week: number) => {
  if (isDisabled.value) return
  const value = `${viewYear.value}-W${String(week).padStart(2, '0')}`
  emit('update:modelValue', value)
  emit('change', value)
  void validateOnChange()
}

const prevYear = () => {
  if (viewYear.value > props.minYear) viewYear.value -= 1
}

const nextYear = () => {
  if (viewYear.value < props.maxYear) viewYear.value += 1
}

const isSelected = (week: number) =>
  parsed.value?.year === viewYear.value && parsed.value?.week === week

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
  void validateOnBlur()
}

function handleListKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return
  const action = resolveKeyboardNavAction(event, { orientation: 'vertical' })
  if (action === 'none') return
  event.preventDefault()
  if (action === 'select') {
    selectWeek(focusWeek.value)
    return
  }
  if (
    action === 'next' ||
    action === 'prev' ||
    action === 'first' ||
    action === 'last'
  ) {
    const next = moveRovingIndex(focusWeek.value - 1, action, weeksInYear.value, true)
    focusWeek.value = next + 1
  }
}
</script>

<template>
  <div :class="['vp-week-picker', props.class]" :style="style" data-component="WeekPicker">
    <div v-if="displayLabel" class="vp-week-picker__value">{{ displayLabel }}</div>
    <div class="vp-week-picker__header">
      <button type="button" class="vp-week-picker__nav" :disabled="isDisabled || viewYear <= minYear" @click="prevYear">‹</button>
      <span class="vp-week-picker__year">{{ viewYear }}</span>
      <button type="button" class="vp-week-picker__nav" :disabled="isDisabled || viewYear >= maxYear" @click="nextYear">›</button>
    </div>
    <div
      v-bind="nativeAttrs"
      :id="inputId"
      class="vp-week-picker__list"
      role="listbox"
      tabindex="0"
      :aria-label="t('component.week-picker.title')"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      @blur="handleBlur"
      @keydown="handleListKeydown"
    >
      <button
        v-for="item in weekOptions"
        :key="item.week"
        type="button"
        role="option"
        :class="[
          'vp-week-picker__row',
          {
            'vp-week-picker__row--active': isSelected(item.week),
            'vp-week-picker__row--focused': focusWeek === item.week
          }
        ]"
        :disabled="isDisabled"
        :aria-selected="isSelected(item.week)"
        @click="selectWeek(item.week)"
        @mouseenter="focusWeek = item.week"
      >
        <span class="vp-week-picker__week">W{{ item.week }}</span>
        <span class="vp-week-picker__range">{{ item.range }}</span>
      </button>
    </div>
  </div>
</template>
