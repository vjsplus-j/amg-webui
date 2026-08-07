<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import {
  getFloatingPanelStyle,
  moveRovingIndex,
  resolveKeyboardNavAction
} from '@amg-webui/utils'
import type { TimeSelectProps, TimeSelectEmits } from './types'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'TimeSelect' })

const props = withDefaults(defineProps<TimeSelectProps>(), {
  modelValue: null,
  start: '00:00',
  end: '23:30',
  step: '00:30',
  clearable: true,
  disabled: false,
  size: 'md',
  telemetry: undefined
})

const emit = defineEmits<TimeSelectEmits>()
const { t } = useLocale()

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

const isOpen = ref(false)
const activeIndex = ref(-1)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
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

const parseMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const formatMinutes = (total: number): string => {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const timeOptions = computed(() => {
  const startMin = parseMinutes(props.start)
  const endMin = parseMinutes(props.end)
  const stepMin = parseMinutes(props.step)
  if (stepMin <= 0 || startMin > endMin) return []

  const options: string[] = []
  for (let t = startMin; t <= endMin; t += stepMin) {
    options.push(formatMinutes(t))
  }
  return options
})

const displayLabel = computed(() => {
  if (props.modelValue) return props.modelValue
  return props.placeholder ?? t(LocaleKeys.component.timeSelect.placeholder)
})

const isPlaceholder = computed(() => !props.modelValue)

const rootClass = computed(() => [
  'vp-time-select',
  `vp-time-select--size-${props.size}`,
  {
    'vp-time-select--open': isOpen.value,
    'vp-time-select--disabled': isDisabled.value
  },
  props.class
])

const close = () => {
  isOpen.value = false
  activeIndex.value = -1
  floatingPanelStyle.value = {}
}

const open = () => {
  if (isDisabled.value) return
  isOpen.value = true
  const idx = timeOptions.value.indexOf(props.modelValue ?? '')
  activeIndex.value = idx >= 0 ? idx : 0
  nextTick(syncFloating)
}

const toggle = () => {
  if (isOpen.value) close()
  else open()
}

const selectTime = (time: string) => {
  emit('update:modelValue', time)
  emit('change', time)
  void validateOnChange()
  trackEmit({
    component: 'TimeSelect',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value: time }
  })
  close()
}

const onClear = (event: MouseEvent) => {
  event.stopPropagation()
  emit('update:modelValue', null)
  emit('change', null)
  emit('clear')
  void validateOnChange()
  trackEmit({
    component: 'TimeSelect',
    type: 'clear',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
}

const handleOutsideClick = (event: MouseEvent) => {
  if (!isOpen.value) return
  const target = event.target as HTMLElement
  if (!triggerRef.value?.contains(target) && !panelRef.value?.contains(target)) {
    close()
  }
}

const onTriggerKeydown = (event: KeyboardEvent) => {
  if (isDisabled.value) return
  const action = resolveKeyboardNavAction(event, { orientation: 'vertical' })

  if (!isOpen.value) {
    if (action === 'next' || action === 'select' || event.key === 'ArrowDown') {
      event.preventDefault()
      open()
    }
    return
  }

  const len = timeOptions.value.length
  if (!len) return

  if (action === 'close') {
    event.preventDefault()
    close()
    triggerRef.value?.focus()
    return
  }
  if (
    action === 'next' ||
    action === 'prev' ||
    action === 'first' ||
    action === 'last'
  ) {
    event.preventDefault()
    activeIndex.value = moveRovingIndex(
      Math.max(0, activeIndex.value),
      action,
      len,
      true
    )
    return
  }
  if (action === 'select') {
    event.preventDefault()
    if (activeIndex.value >= 0) {
      selectTime(timeOptions.value[activeIndex.value])
    }
  }
}

const handleTriggerBlur = () => {
  void validateOnBlur()
}

watch(isOpen, (openState) => {
  if (openState) nextTick(syncFloating)
  else floatingPanelStyle.value = {}
})

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
  <div :class="rootClass" :style="style" data-component="TimeSelect">
    <button
      ref="triggerRef"
      v-bind="nativeAttrs"
      :id="inputId"
      type="button"
      class="vp-time-select__trigger"
      role="combobox"
      :disabled="isDisabled"
      :aria-label="t(LocaleKeys.component.timeSelect.aria)"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      @click="toggle"
      @keydown="onTriggerKeydown"
      @blur="handleTriggerBlur"
    >
      <span
        v-if="clearable && modelValue"
        class="vp-time-select__clear"
        role="button"
        tabindex="-1"
        :aria-label="t(LocaleKeys.component.timeSelect.clear)"
        @click="onClear"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </span>

      <span
        class="vp-time-select__label"
        :class="{ 'vp-time-select__label--placeholder': isPlaceholder }"
      >
        {{ displayLabel }}
      </span>

      <span class="vp-time-select__icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </span>
    </button>

    <ul
      v-if="isOpen"
      ref="panelRef"
      class="vp-time-select__panel"
      role="listbox"
      :style="panelMergedStyle"
      :aria-label="t(LocaleKeys.component.timeSelect.aria)"
    >
      <li
        v-for="(time, idx) in timeOptions"
        :key="time"
        role="option"
        class="vp-time-select__option"
        :class="{
          'vp-time-select__option--selected': modelValue === time,
          'vp-time-select__option--active': activeIndex === idx
        }"
        :aria-selected="modelValue === time"
        @click="selectTime(time)"
        @mouseenter="activeIndex = idx"
      >
        {{ time }}
      </li>
    </ul>
  </div>
</template>
