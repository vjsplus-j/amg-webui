<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { formatWithIntl } from '@amg-webui/utils'
import type { QuarterPickerProps, QuarterPickerEmits } from './types'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'QuarterPicker' })

const props = withDefaults(defineProps<QuarterPickerProps>(), {
  modelValue: null,
  minYear: 2000,
  maxYear: 2100
})

const emit = defineEmits<QuarterPickerEmits>()
const { locale } = useLocale()

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

const parsed = computed(() => {
  const raw = props.modelValue
  if (!raw) return null
  const match = /^(\d{4})-Q([1-4])$/.exec(String(raw))
  if (!match) return null
  return { year: Number(match[1]), quarter: Number(match[2]) }
})

watch(
  parsed,
  (val) => {
    if (val) viewYear.value = val.year
  },
  { immediate: true }
)

const quarters = computed(() => {
  void locale.value
  return [1, 2, 3, 4].map((q) => {
    const month = (q - 1) * 3
    const label = formatWithIntl(new Date(viewYear.value, month, 1), { month: 'short' })
    return { quarter: q, label: `Q${q} · ${label}` }
  })
})

const displayLabel = computed(() => {
  if (!parsed.value) return ''
  void locale.value
  const { year, quarter } = parsed.value
  const month = (quarter - 1) * 3
  const range = formatWithIntl(new Date(year, month, 1), { month: 'short', year: 'numeric' })
  return `${range} (Q${quarter})`
})

const selectQuarter = (quarter: number) => {
  if (isDisabled.value) return
  const value = `${viewYear.value}-Q${quarter}`
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

const isSelected = (quarter: number) =>
  parsed.value?.year === viewYear.value && parsed.value?.quarter === quarter

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
  void validateOnBlur()
}
</script>

<template>
  <div :class="['vp-quarter-picker', props.class]" :style="style" data-component="QuarterPicker">
    <div v-if="displayLabel" class="vp-quarter-picker__value">{{ displayLabel }}</div>
    <div class="vp-quarter-picker__header">
      <button type="button" class="vp-quarter-picker__nav" :disabled="isDisabled || viewYear <= minYear" @click="prevYear">‹</button>
      <span class="vp-quarter-picker__year">{{ viewYear }}</span>
      <button type="button" class="vp-quarter-picker__nav" :disabled="isDisabled || viewYear >= maxYear" @click="nextYear">›</button>
    </div>
    <div
      v-bind="nativeAttrs"
      :id="inputId"
      class="vp-quarter-picker__grid"
      role="listbox"
      tabindex="0"
      :aria-label="ariaLabel"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      @blur="handleBlur"
    >
      <button
        v-for="item in quarters"
        :key="item.quarter"
        type="button"
        role="option"
        :class="['vp-quarter-picker__cell', { 'vp-quarter-picker__cell--active': isSelected(item.quarter) }]"
        :disabled="isDisabled"
        :aria-selected="isSelected(item.quarter)"
        @click="selectQuarter(item.quarter)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
