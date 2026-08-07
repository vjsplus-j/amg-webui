<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { AutoCompleteProps, AutoCompleteEmits } from './types'
import { useAutoComplete } from './useAutoComplete'
import { useVirtualWindow } from '../Transfer/useVirtualWindow'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
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
  validateOnBlur,
  validateOnChange
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid
})

const { nativeAttrs } = useNativeInputAttrs()

const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const activeIndex = ref(-1)

const { isOpen, suggestions, rootClass, fetchSuggestions } = useAutoComplete(
  props,
  (query, cb) => emit('fetchSuggestions', query, cb)
)

const suggestionValues = computed(() => suggestions.value)
const virtual = useVirtualWindow(suggestionValues)

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
  void validateOnChange()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return
  const count = suggestions.value.length
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = Math.min(count - 1, activeIndex.value + 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = Math.max(0, activeIndex.value - 1)
  } else if (event.key === 'Enter' && activeIndex.value >= 0) {
    event.preventDefault()
    selectItem(suggestions.value[activeIndex.value].value)
  } else if (event.key === 'Escape') {
    isOpen.value = false
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
  }
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onUnmounted(() => document.removeEventListener('click', handleOutsideClick))
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
      :aria-expanded="isOpen"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      @input="handleInput"
      @focus="emit('focus', $event); fetchSuggestions(modelValue ?? '')"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />
    <div v-if="isOpen && suggestions.length" ref="panelRef" class="vp-autocomplete__panel">
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
