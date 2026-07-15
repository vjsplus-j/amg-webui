<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePopover } from '@amg-webui/hooks'
import { toISODate } from '@amg-webui/utils'
import type { YearPickerProps, YearPickerEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<YearPickerProps>(), {
  modelValue: null,
  valueFormat: 'number',
  yearRange: 12
})

const emit = defineEmits<YearPickerEmits>()

const { isOpen, triggerRef, panelRef, toggle, close } = usePopover()

const selectedYear = computed(() => {
  if (!props.modelValue) return null
  if (typeof props.modelValue === 'number') return props.modelValue
  if (props.modelValue instanceof Date) return props.modelValue.getFullYear()
  const parsed = Number(String(props.modelValue).slice(0, 4))
  return Number.isNaN(parsed) ? null : parsed
})

const startYear = ref(
  (selectedYear.value ?? new Date().getFullYear()) - Math.floor(props.yearRange / 2)
)

const years = computed(() =>
  Array.from({ length: props.yearRange }, (_, i) => startYear.value + i)
)

const displayLabel = computed(() => {
  if (selectedYear.value == null) return ''
  return String(selectedYear.value)
})

const isPlaceholder = computed(() => props.modelValue == null && !!props.placeholder)

const emitValue = (year: number) => {
  let value: string | Date | number
  if (props.valueFormat === 'number') {
    value = year
  } else if (props.valueFormat === 'date') {
    value = new Date(year, 0, 1)
  } else {
    value = toISODate(new Date(year, 0, 1))
  }
  emit('update:modelValue', value)
  emit('change', value)
  close()
}

const prevRange = () => {
  startYear.value -= props.yearRange
}

const nextRange = () => {
  startYear.value += props.yearRange
}

const handleTriggerClick = () => {
  if (props.disabled) return
  toggle()
}
</script>

<template>
  <div :class="['vp-yearpicker', props.class]" :style="style">
    <button
      ref="triggerRef"
      type="button"
      class="vp-yearpicker__trigger"
      :disabled="disabled"
      @click="handleTriggerClick"
    >
      <span
        :class="['vp-yearpicker__label', { 'vp-yearpicker__label--placeholder': isPlaceholder }]"
      >
        {{ isPlaceholder ? placeholder : displayLabel }}
      </span>
      <span aria-hidden="true">v</span>
    </button>

    <div v-if="isOpen" ref="panelRef" class="vp-yearpicker__panel">
      <div class="vp-yearpicker__header">
        <span>{{ years[0] }} –{{ years[years.length - 1] }}</span>
        <div class="vp-yearpicker__nav">
          <button type="button" class="vp-yearpicker__nav-btn" @click="prevRange">‹</button>
          <button type="button" class="vp-yearpicker__nav-btn" @click="nextRange">›</button>
        </div>
      </div>
      <div class="vp-yearpicker__grid">
        <button
          v-for="year in years"
          :key="year"
          type="button"
          :class="[
            'vp-yearpicker__year',
            { 'vp-yearpicker__year--selected': year === selectedYear }
          ]"
          @click="emitValue(year)"
        >
          {{ year }}
        </button>
      </div>
    </div>
  </div>
</template>
