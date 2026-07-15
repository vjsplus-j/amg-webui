<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { SearchProps, SearchEmits } from './types'
import { useSearch } from './useSearch'
import './style.scss'

const props = withDefaults(defineProps<SearchProps>(), {
  modelValue: '',
  clearable: true,
  size: 'md'
})

const emit = defineEmits<SearchEmits>()
const { t } = useLocale()
const { rootClass } = useSearch(props)

const resolvedPlaceholder = computed(
  () => props.placeholder ?? t(LocaleKeys.common.search)
)

const searchLabel = computed(() => t(LocaleKeys.common.search))
const closeLabel = computed(() => t(LocaleKeys.common.close))

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleSearch = () => {
  if (props.disabled) return
  emit('search', props.modelValue ?? '')
}

const handleClear = () => {
  if (props.disabled) return
  emit('update:modelValue', '')
  emit('clear')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    handleSearch()
  }
}
</script>

<template>
  <div :class="rootClass" :style="style">
    <input
      class="vp-search__input"
      type="search"
      :value="modelValue"
      :placeholder="resolvedPlaceholder"
      :disabled="disabled"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
    <button
      v-if="clearable && modelValue"
      type="button"
      class="vp-search__clear"
      :disabled="disabled"
      :aria-label="closeLabel"
      @click="handleClear"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      </svg>
    </button>
    <button
      type="button"
      class="vp-search__btn"
      :disabled="disabled"
      :aria-label="searchLabel"
      @click="handleSearch"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      </svg>
    </button>
  </div>
</template>
