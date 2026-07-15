<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import InputText from '../InputText/index.vue'
import FilterBar from '../FilterBar/index.vue'
import Button from '../Button/index.vue'
import type { SearchFilterPanelProps, SearchFilterPanelEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<SearchFilterPanelProps>(), {
  keyword: '',
  modelValue: () => [],
  fields: () => [],
  collapsed: false,
  loading: false
})

const emit = defineEmits<SearchFilterPanelEmits>()
const { t } = useLocale()

const localKeyword = ref(props.keyword)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const onKeyword = (value: string) => {
  localKeyword.value = value
  emit('update:keyword', value)
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', { keyword: value, conditions: props.modelValue ?? [] })
  }, 400)
}

const onSearch = () => {
  emit('search', { keyword: localKeyword.value, conditions: props.modelValue ?? [] })
}

const onReset = () => {
  localKeyword.value = ''
  emit('update:keyword', '')
  emit('update:modelValue', [])
  emit('reset')
}
</script>

<template>
  <div :class="['vp-search-filter-panel', props.class]" :style="style" data-component="SearchFilterPanel">
    <div class="vp-search-filter-panel__search">
      <InputText
        class="vp-search-filter-panel__keyword"
        :model-value="localKeyword"
        :disabled="disabled"
        :placeholder="t(LocaleKeys.common.search)"
        @update:model-value="onKeyword"
      />
      <Button :label="loading ? t(LocaleKeys.common.loading) : t(LocaleKeys.common.search)" :loading="loading" :disabled="disabled" @click="onSearch" />
      <Button variant="outlined" :label="t(LocaleKeys.button.reset)" :disabled="disabled" @click="onReset" />
    </div>
    <FilterBar
      :model-value="modelValue"
      :fields="fields"
      :collapsed="collapsed"
      :loading="loading"
      :disabled="disabled"
      @update:model-value="(v) => emit('update:modelValue', v)"
      @update:collapsed="(v) => emit('update:collapsed', v)"
      @search="(conditions) => emit('search', { keyword: localKeyword, conditions })"
      @reset="onReset"
    />
    <slot />
  </div>
</template>
