<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import InputText from '../InputText/index.vue'
import Select from '../Select/index.vue'
import Button from '../Button/index.vue'
import type { AdvancedSearchProps, AdvancedSearchEmits, SearchLogic } from './types'
import type { FilterCondition } from '../FilterBar/types'
import './style.scss'

const props = withDefaults(defineProps<AdvancedSearchProps>(), {
  modelValue: () => [],
  logic: 'and',
  fields: () => [],
  templates: () => [],
  loading: false
})

const emit = defineEmits<AdvancedSearchEmits>()
const { t } = useLocale()

const localLogic = ref<SearchLogic>(props.logic)

const operatorOptions = computed(() => [
  { label: '=', value: 'eq' },
  { label: '!=', value: 'ne' },
  { label: t(LocaleKeys.common.search), value: 'contains' }
])

const logicOptions = [
  { label: 'AND', value: 'and' },
  { label: 'OR', value: 'or' }
]

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
const conditions = computed(() => props.modelValue ?? [])

const emitConditions = (next: FilterCondition[]) => {
  emit('update:modelValue', next)
  emit('change', next)
}

const addRow = () => {
  emitConditions([
    ...conditions.value,
    { id: uid(), field: props.fields[0]?.value ?? '', operator: 'contains', value: '' }
  ])
}

const updateRow = (id: string, patch: Partial<FilterCondition>) => {
  emitConditions(conditions.value.map((row) => (row.id === id ? { ...row, ...patch } : row)))
}

const removeRow = (id: string) => {
  emitConditions(conditions.value.filter((row) => row.id !== id))
}

const onLogicChange = (value: unknown) => {
  localLogic.value = value as SearchLogic
  emit('update:logic', localLogic.value)
}

const onSearch = () => {
  emit('search', { conditions: conditions.value, logic: localLogic.value })
}

const applyTemplate = (id: string) => {
  const tpl = props.templates.find((t) => t.id === id)
  if (!tpl) return
  emitConditions(tpl.conditions.map((c) => ({ ...c, id: uid() })))
  localLogic.value = tpl.logic
  emit('update:logic', tpl.logic)
}

const saveTemplate = () => {
  emit('save-template', { conditions: conditions.value, logic: localLogic.value })
}
</script>

<template>
  <div :class="['vp-advanced-search', props.class]" :style="style" data-component="AdvancedSearch">
    <div class="vp-advanced-search__head">
      <h3 class="vp-advanced-search__title">{{ t('component.advanced-search.title') }}</h3>
      <div class="vp-advanced-search__logic">
        <Select :model-value="localLogic" :options="logicOptions" :disabled="disabled" @update:model-value="onLogicChange" />
      </div>
    </div>
    <div v-for="row in conditions" :key="row.id" class="vp-advanced-search__row">
      <Select class="vp-advanced-search__field" :model-value="row.field" :options="fields" :disabled="disabled" @update:model-value="(v) => updateRow(row.id, { field: String(v) })" />
      <Select class="vp-advanced-search__op" :model-value="row.operator" :options="operatorOptions" :disabled="disabled" @update:model-value="(v) => updateRow(row.id, { operator: String(v) })" />
      <InputText class="vp-advanced-search__value" :model-value="row.value" :disabled="disabled" :placeholder="t(LocaleKeys.common.search)" @update:model-value="(v) => updateRow(row.id, { value: v })" />
      <Button variant="text" size="sm" severity="danger" :label="t(LocaleKeys.button.delete)" :disabled="disabled" @click="removeRow(row.id)" />
    </div>
    <div class="vp-advanced-search__toolbar">
      <Button variant="outlined" size="sm" :label="t(LocaleKeys.button.create)" :disabled="disabled" @click="addRow" />
      <Button :label="loading ? t(LocaleKeys.common.loading) : t(LocaleKeys.common.search)" :loading="loading" :disabled="disabled" @click="onSearch" />
      <Button variant="outlined" :label="t(LocaleKeys.button.save)" :disabled="disabled" @click="saveTemplate" />
      <Select
        v-if="templates.length"
        class="vp-advanced-search__templates"
        :placeholder="t(LocaleKeys.common.more)"
        :options="templates.map((tpl) => ({ label: tpl.name, value: tpl.id }))"
        :disabled="disabled"
        @update:model-value="(v) => applyTemplate(String(v))"
      />
    </div>
    <slot />
  </div>
</template>
