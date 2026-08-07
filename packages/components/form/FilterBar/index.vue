<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import InputText from '../InputText/index.vue'
import Select from '../Select/index.vue'
import Button from '@amg-webui/core/Button/index.vue'
import type { FilterBarProps, FilterBarEmits, FilterCondition } from './types'
import './style.scss'

const props = withDefaults(defineProps<FilterBarProps>(), {
  modelValue: () => [],
  fields: () => [],
  collapsed: false,
  loading: false
})

const emit = defineEmits<FilterBarEmits>()
const { t } = useLocale()

const isCollapsed = ref(props.collapsed)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.collapsed,
  (val) => {
    isCollapsed.value = val
  }
)

const operatorOptions = computed(() => [
  { label: '=', value: 'eq' },
  { label: '!=', value: 'ne' },
  { label: '>', value: 'gt' },
  { label: '<', value: 'lt' },
  { label: t(LocaleKeys.common.search), value: 'contains' }
])

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

const conditions = computed(() => props.modelValue ?? [])

const emitConditions = (next: FilterCondition[]) => {
  emit('update:modelValue', next)
  emit('change', next)
}

const addRow = () => {
  const field = props.fields[0]?.value ?? ''
  emitConditions([
    ...conditions.value,
    { id: uid(), field, operator: 'contains', value: '' }
  ])
}

const updateRow = (id: string, patch: Partial<FilterCondition>) => {
  emitConditions(conditions.value.map((row) => (row.id === id ? { ...row, ...patch } : row)))
}

const removeRow = (id: string) => {
  emitConditions(conditions.value.filter((row) => row.id !== id))
}

const onSearch = () => {
  emit('search', conditions.value)
}

const onReset = () => {
  emitConditions([])
  emit('reset')
}

const onValueInput = (id: string, value: string) => {
  updateRow(id, { value })
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(onSearch, 400)
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  emit('update:collapsed', isCollapsed.value)
}
</script>

<template>
  <div :class="['vp-filter-bar', props.class, { 'vp-filter-bar--collapsed': isCollapsed }]" :style="style" data-component="FilterBar">
    <div class="vp-filter-bar__header">
      <h3 class="vp-filter-bar__title">{{ t('component.filter-bar.title') }}</h3>
      <Button variant="text" size="sm" :label="isCollapsed ? t(LocaleKeys.common.expandMenu) : t(LocaleKeys.common.collapseMenu)" @click="toggleCollapse" />
    </div>
    <div v-show="!isCollapsed" class="vp-filter-bar__body">
      <div v-for="row in conditions" :key="row.id" class="vp-filter-bar__row">
        <Select
          class="vp-filter-bar__field"
          :model-value="row.field"
          :options="fields"
          :disabled="disabled"
          @update:model-value="(v) => updateRow(row.id, { field: String(v) })"
        />
        <Select
          class="vp-filter-bar__op"
          :model-value="row.operator"
          :options="operatorOptions"
          :disabled="disabled"
          @update:model-value="(v) => updateRow(row.id, { operator: String(v) })"
        />
        <InputText
          class="vp-filter-bar__value"
          :model-value="row.value"
          :disabled="disabled"
          :placeholder="t(LocaleKeys.common.search)"
          @update:model-value="(v) => onValueInput(row.id, v)"
        />
        <Button variant="text" size="sm" severity="danger" :label="t(LocaleKeys.button.delete)" :disabled="disabled" @click="removeRow(row.id)" />
      </div>
      <div class="vp-filter-bar__toolbar">
        <Button variant="outlined" size="sm" :label="t(LocaleKeys.button.create)" :disabled="disabled" @click="addRow" />
        <Button :label="loading ? t(LocaleKeys.common.loading) : t(LocaleKeys.common.search)" :loading="loading" :disabled="disabled" @click="onSearch" />
        <Button variant="outlined" :label="t(LocaleKeys.button.reset)" :disabled="disabled" @click="onReset" />
      </div>
    </div>
    <slot />
  </div>
</template>
