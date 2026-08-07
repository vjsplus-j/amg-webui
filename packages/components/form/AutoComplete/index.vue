<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  resolveKeyboardNavAction,
  moveRovingIndex,
  getFloatingPanelStyle
} from '@amg-webui/utils'
import { getDocument, isClient } from '@amg-webui/utils/env'
import type { AutoCompleteProps, AutoCompleteEmits } from './types'
import { useAutoComplete } from './useAutoComplete'
import { useVirtualWindow } from '../Transfer/useVirtualWindow'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import { useControlAriaLabel } from '../FormItem/useControlAriaLabel'
import { LocaleKeys } from '@amg-webui/locale'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'AutoComplete' })

const props = withDefaults(defineProps<AutoCompleteProps>(), {
  modelValue: '',
  suggestions: () => [],
  debounce: 300,
  size: 'md'
})

const emit = defineEmits<AutoCompleteEmits>()

const {
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  hasVisibleLabel,
  ariaLabelledby,
  validateOnBlur,
  validateOnChange
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid
})

const { nativeAttrs } = useNativeInputAttrs()

const inputAriaLabel = useControlAriaLabel(
  () => props.ariaLabel,
  LocaleKeys.component.autocomplete.aria,
  hasVisibleLabel
)

const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const activeIndex = ref(-1)
const floatingPanelStyle = ref<Record<string, string>>({})

const { isOpen, suggestions, rootClass, fetchSuggestions } = useAutoComplete(
  props,
  (query, cb) => emit('fetchSuggestions', query, cb)
)

const suggestionValues = computed(() => suggestions.value)
const virtual = useVirtualWindow(suggestionValues)

const panelMergedStyle = computed(() => ({
  ...floatingPanelStyle.value
}))

function syncFloating() {
  if (!isOpen.value || !inputRef.value) {
    floatingPanelStyle.value = {}
    return
  }
  const { style } = getFloatingPanelStyle(inputRef.value, panelRef.value, {
    placement: 'bottom-start',
    matchTriggerWidth: true,
    offset: 4
  })
  floatingPanelStyle.value = style
}

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  activeIndex.value = -1
  fetchSuggestions(value)
  void validateOnChange()
}

const selectItem = (value: string) => {
  emit('update:modelValue', value)
  emit('select', value)
  isOpen.value = false
  floatingPanelStyle.value = {}
  void validateOnChange()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return
  const action = resolveKeyboardNavAction(event, { orientation: 'vertical' })
  // Allow typing in the input; only handle nav / escape / enter-select
  if (action === 'none') return
  if (action === 'select' && event.key === ' ') return
  event.preventDefault()
  if (action === 'close') {
    isOpen.value = false
    floatingPanelStyle.value = {}
    return
  }
  const count = suggestions.value.length
  if (
    action === 'next' ||
    action === 'prev' ||
    action === 'first' ||
    action === 'last'
  ) {
    activeIndex.value = moveRovingIndex(activeIndex.value, action, count, true)
    return
  }
  if (action === 'select' && activeIndex.value >= 0) {
    selectItem(suggestions.value[activeIndex.value].value)
  }
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
  void validateOnBlur()
}

const handleOutsideClick = (event: MouseEvent) => {
  const target = event.target as Node
  if (
    !inputRef.value?.contains(target) &&
    !panelRef.value?.contains(target)
  ) {
    isOpen.value = false
    floatingPanelStyle.value = {}
  }
}

onMounted(() => {
  if (!isClient) return
  getDocument()?.addEventListener('click', handleOutsideClick)
})
onUnmounted(() => {
  getDocument()?.removeEventListener('click', handleOutsideClick)
})

watch(isOpen, (open) => {
  if (open) nextTick(syncFloating)
  else floatingPanelStyle.value = {}
})

watch(suggestions, () => {
  if (isOpen.value) nextTick(syncFloating)
})
</script>

<template>
  <div :class="rootClass" :style="style">
    <input
      ref="inputRef"
      v-bind="nativeAttrs"
      :id="inputId"
      class="vp-autocomplete__input"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      autocomplete="off"
      role="combobox"
      :aria-label="inputAriaLabel"
      :aria-labelledby="ariaLabelledby"
      :aria-expanded="isOpen"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      @input="handleInput"
      @focus="emit('focus', $event); fetchSuggestions(modelValue ?? '')"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />
    <div
      v-if="isOpen && suggestions.length"
      ref="panelRef"
      class="vp-autocomplete__panel"
      :style="panelMergedStyle"
    >
      <div class="vp-autocomplete__list" @scroll="virtual.onScroll">
        <div :style="{ height: `${virtual.totalHeight.value}px`, position: 'relative' }">
          <div :style="{ transform: `translateY(${virtual.offsetY.value}px)` }">
            <div
              v-for="{ item, index } in virtual.visibleItems.value"
              :key="`${item.value}-${index}`"
              class="vp-autocomplete__item"
              :class="{ 'vp-autocomplete__item--active': index === activeIndex }"
              :style="{ height: `${virtual.ITEM_HEIGHT}px` }"
              @mousedown.prevent="selectItem(item.value)"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
