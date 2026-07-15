<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { SelectProps, SelectEmits } from './types'
import { useSelect } from './useSelect'
import './style.scss'

const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
  size: 'md'
})

const emit = defineEmits<SelectEmits>()

const {
  isOpen,
  filterText,
  triggerRef,
  panelRef,
  filterRef,
  filteredOptions,
  displayLabel,
  isPlaceholder,
  triggerClass,
  selectClass,
  selectStyle,
  toggle,
  close,
  selectOption,
  clear
} = useSelect(props)

const handleTriggerClick = () => {
  toggle()
  if (isOpen.value) {
    emit('show')
  } else {
    emit('hide')
  }
}

const handleFocus = () => {
  emit('focus', {} as FocusEvent)
}

const handleBlur = () => {
  emit('blur', {} as FocusEvent)
}

const handleOptionClick = (option: typeof props.options[0]) => {
  selectOption(option)
  emit('change', { originalEvent: {} as Event, value: option.value })
  emit('update:modelValue', option.value)
}

const handleClear = (event: MouseEvent) => {
  event.stopPropagation()
  clear()
  emit('update:modelValue', undefined)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) {
    if (event.key === 'ArrowDown' || event.key === 'Enter') {
      toggle()
      emit('show')
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})

const handleOutsideClick = (event: MouseEvent) => {
  if (isOpen.value) {
    const target = event.target as HTMLElement
    if (!triggerRef.value?.contains(target) && !panelRef.value?.contains(target)) {
      close()
      emit('hide')
    }
  }
}
</script>

<template>
  <div :class="selectClass" :style="{ ...style, ...selectStyle }">
    <div
      ref="triggerRef"
      :class="triggerClass"
      :disabled="disabled"
      @click="handleTriggerClick"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      tabindex="0"
    >
      <span v-if="clearable && modelValue" class="p-select-clear-icon" @click="handleClear">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </span>
      
      <span :class="['p-select-label', { 'p-select-placeholder': isPlaceholder }]">
        {{ displayLabel }}
      </span>
      
      <span class="p-select-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </span>
    </div>
    
    <div v-if="isOpen" ref="panelRef" :class="['p-select-panel', panelClass]" :style="panelStyle">
      <div v-if="filterable" class="p-select-filter-container">
        <input
          ref="filterRef"
          v-model="filterText"
          type="text"
          class="p-select-filter"
          placeholder="Search..."
        />
      </div>
      
      <div class="p-select-items">
        <div v-if="filteredOptions.length === 0" class="p-select-empty-message">
          No results found
        </div>
        
        <div
          v-for="option in filteredOptions"
          :key="String(option.value)"
          :class="['p-select-item', {
            'p-select-item-selected': option.value === modelValue,
            'p-select-item-disabled': option.disabled
          }]"
          @click="handleOptionClick(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
    
    <slot />
  </div>
</template>
