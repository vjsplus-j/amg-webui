<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Select from '../Select/index.vue'
import Button from '../Button/index.vue'
import type { TemplateSelectProps, TemplateSelectEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<TemplateSelectProps>(), {
  modelValue: null,
  templates: () => []
})

const emit = defineEmits<TemplateSelectEmits>()
const { t } = useLocale()

const options = computed(() =>
  props.templates.map((tpl) => ({ label: tpl.name, value: tpl.id }))
)

const selected = computed(() => props.templates.find((tpl) => tpl.id === props.modelValue) ?? null)

const onSelect = (id: unknown) => {
  const value = id == null ? null : String(id)
  emit('update:modelValue', value)
  const tpl = props.templates.find((t) => t.id === value) ?? null
  emit('change', tpl)
}

const applyTemplate = () => {
  if (!selected.value) return
  emit('apply', selected.value.data)
}
</script>

<template>
  <div :class="['vp-template-select', props.class, { 'vp-template-select--disabled': disabled }]" :style="style" data-component="TemplateSelect">
    <Select
      class="vp-template-select__select"
      :model-value="modelValue"
      :options="options"
      :disabled="disabled"
      :placeholder="t('component.template-select.title')"
      @update:model-value="onSelect"
    />
    <Button variant="outlined" :label="t(LocaleKeys.button.enter)" :disabled="disabled || !selected" @click="applyTemplate" />
    <div v-if="selected" class="vp-template-select__preview">
      <h4 class="vp-template-select__name">{{ selected.name }}</h4>
      <p v-if="selected.description" class="vp-template-select__desc">{{ selected.description }}</p>
      <pre v-if="selected.preview" class="vp-template-select__code">{{ selected.preview }}</pre>
      <ul v-else class="vp-template-select__fields">
        <li v-for="(val, key) in selected.data" :key="String(key)">
          <strong>{{ key }}:</strong> {{ String(val) }}
        </li>
      </ul>
    </div>
    <slot />
  </div>
</template>
