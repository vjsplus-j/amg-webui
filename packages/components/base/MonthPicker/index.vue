<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale, usePopover } from '@amg-webui/hooks'
import { getMonthLabels, parseISODate, toISODate, formatWithIntl } from '@amg-webui/utils'
import type { MonthPickerProps, MonthPickerEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<MonthPickerProps>(), {
  modelValue: null,
  valueFormat: 'iso'
})

const emit = defineEmits<MonthPickerEmits>()

const { locale } = useLocale()
const { isOpen, triggerRef, panelRef, toggle, close } = usePopover()

const viewYear = ref(new Date().getFullYear())

const selectedDate = computed(() => {
  if (!props.modelValue) return null
  if (props.modelValue instanceof Date) return props.modelValue
  return parseISODate(String(props.modelValue))
})

watch(
  selectedDate,
  (val) => {
    if (val) viewYear.value = val.getFullYear()
  },
  { immediate: true }
)

const monthLabels = computed(() => {
  void locale.value
  return getMonthLabels(viewYear.value)
})

const displayLabel = computed(() => {
  if (!selectedDate.value) return ''
  void locale.value
  return formatWithIntl(selectedDate.value, { year: 'numeric', month: 'long' })
})

const isPlaceholder = computed(() => !props.modelValue && !!props.placeholder)

const emitValue = (month: number) => {
  const d = new Date(viewYear.value, month, 1)
  const value = props.valueFormat === 'date' ? d : toISODate(d)
  emit('update:modelValue', value)
  emit('change', value)
  close()
}

const prevYear = () => {
  viewYear.value -= 1
}

const nextYear = () => {
  viewYear.value += 1
}

const handleTriggerClick = () => {
  if (props.disabled) return
  toggle()
}
</script>

<template>
  <div :class="['vp-monthpicker', props.class]" :style="style">
    <button
      ref="triggerRef"
      type="button"
      class="vp-monthpicker__trigger"
      :disabled="disabled"
      @click="handleTriggerClick"
    >
      <span
        :class="['vp-monthpicker__label', { 'vp-monthpicker__label--placeholder': isPlaceholder }]"
      >
        {{ isPlaceholder ? placeholder : displayLabel }}
      </span>
      <span aria-hidden="true">v</span>
    </button>

    <div v-if="isOpen" ref="panelRef" class="vp-monthpicker__panel">
      <div class="vp-monthpicker__header">
        <span>{{ viewYear }}</span>
        <div class="vp-monthpicker__nav">
          <button type="button" class="vp-monthpicker__nav-btn" @click="prevYear">‹</button>
          <button type="button" class="vp-monthpicker__nav-btn" @click="nextYear">›</button>
        </div>
      </div>
      <div class="vp-monthpicker__grid">
        <button
          v-for="(label, index) in monthLabels"
          :key="index"
          type="button"
          :class="[
            'vp-monthpicker__month',
            {
              'vp-monthpicker__month--selected':
                selectedDate &&
                selectedDate.getFullYear() === viewYear &&
                selectedDate.getMonth() === index
            }
          ]"
          @click="emitValue(index)"
        >
          {{ label }}
        </button>
      </div>
    </div>
  </div>
</template>
