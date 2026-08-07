<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import {
  moveRovingIndex,
  resolveKeyboardNavAction
} from '@amg-webui/utils'
import Select from '@amg-webui/form/Select/index.vue'
import Button from '@amg-webui/core/Button/index.vue'
import InputText from '@amg-webui/form/InputText/index.vue'
import Empty from '@amg-webui/core/Empty/index.vue'
import Card from '@amg-webui/core/Card/index.vue'
import type { TemplateSelectProps, TemplateSelectEmits, FormTemplate } from './types'
import './style.scss'

const props = withDefaults(defineProps<TemplateSelectProps>(), {
  modelValue: null,
  templates: () => [],
  layout: 'dropdown',
  searchable: true,
  searchableMin: 4,
  telemetry: undefined
})

const emit = defineEmits<TemplateSelectEmits>()
const { t } = useLocale()

const query = ref('')
const focusCardIndex = ref(0)
const cardsRef = ref<HTMLElement | null>(null)

const showSearch = computed(
  () => props.searchable && props.templates.length >= (props.searchableMin ?? 4)
)

const filteredTemplates = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.templates
  return props.templates.filter(
    (tpl) =>
      tpl.name.toLowerCase().includes(q) ||
      (tpl.description?.toLowerCase().includes(q) ?? false)
  )
})

const options = computed(() =>
  filteredTemplates.value.map((tpl) => ({ label: tpl.name, value: tpl.id }))
)

const selected = computed(
  () => props.templates.find((tpl) => tpl.id === props.modelValue) ?? null
)

const isEmpty = computed(() => props.templates.length === 0)
const isFilterEmpty = computed(() => !isEmpty.value && filteredTemplates.value.length === 0)

function track(type: string, payload?: Record<string, unknown>) {
  trackEmit({
    component: 'TemplateSelect',
    type,
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload
  })
}

const selectTemplate = (tpl: FormTemplate | null) => {
  const value = tpl?.id ?? null
  emit('update:modelValue', value)
  emit('change', tpl)
  track('change', { templateId: value })
}

const onSelect = (id: unknown) => {
  const value = id == null ? null : String(id)
  const tpl = props.templates.find((item) => item.id === value) ?? null
  selectTemplate(tpl)
}

const onCardClick = (tpl: FormTemplate) => {
  if (props.disabled) return
  selectTemplate(tpl)
}

const applyTemplate = () => {
  if (!selected.value) return
  track('apply', { templateId: selected.value.id })
  emit('apply', selected.value.data)
}

function focusActiveCard() {
  const nodes = cardsRef.value?.querySelectorAll<HTMLElement>('.vp-template-select__card-host')
  nodes?.[focusCardIndex.value]?.focus()
}

function handleCardsKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  const count = filteredTemplates.value.length
  if (!count) return
  const action = resolveKeyboardNavAction(event, { orientation: 'vertical' })
  if (action === 'none') return
  event.preventDefault()
  if (action === 'select') {
    const tpl = filteredTemplates.value[focusCardIndex.value]
    if (tpl) selectTemplate(tpl)
    return
  }
  if (
    action === 'next' ||
    action === 'prev' ||
    action === 'first' ||
    action === 'last'
  ) {
    focusCardIndex.value = moveRovingIndex(focusCardIndex.value, action, count, true)
    void nextTick(focusActiveCard)
  }
}
</script>

<template>
  <div
    :class="['vp-template-select', props.class, `vp-template-select--${layout}`, { 'vp-template-select--disabled': disabled }]"
    :style="style"
    data-component="TemplateSelect"
  >
    <InputText
      v-if="showSearch"
      v-model="query"
      type="search"
      class="vp-template-select__search"
      :placeholder="t('component.template-select.search')"
      :disabled="disabled"
    />

    <Empty
      v-if="isEmpty"
      :description="t('component.template-select.empty')"
    />

    <Empty
      v-else-if="isFilterEmpty"
      :description="t('component.template-select.emptyFilter')"
    />

    <template v-else>
      <Select
        v-if="layout === 'dropdown'"
        class="vp-template-select__select"
        :model-value="modelValue ?? undefined"
        :options="options"
        :disabled="disabled"
        :placeholder="t('component.template-select.placeholder')"
        @update:model-value="onSelect"
      />

      <div
        v-else
        ref="cardsRef"
        class="vp-template-select__cards"
        role="listbox"
        tabindex="0"
        :aria-label="t('component.template-select.placeholder')"
        @keydown="handleCardsKeydown"
      >
      <div
        v-for="(tpl, index) in filteredTemplates"
        :key="tpl.id"
        :class="['vp-template-select__card-host', { 'vp-template-select__card--selected': tpl.id === modelValue }]"
        role="option"
        :tabindex="index === focusCardIndex ? 0 : -1"
        :aria-selected="tpl.id === modelValue"
        @click="onCardClick(tpl)"
        @focus="focusCardIndex = index"
        @mouseenter="focusCardIndex = index"
      >
        <Card
          class="vp-template-select__card"
          selectable
          :selected="tpl.id === modelValue"
          :title="tpl.name"
          :subtitle="tpl.description"
        />
      </div>
      </div>

      <div class="vp-template-select__actions">
        <Button
          variant="outlined"
          :label="t('component.template-select.apply')"
          :disabled="disabled || !selected"
          @click="applyTemplate"
        />
      </div>

      <div v-if="selected" class="vp-template-select__preview">
        <slot name="preview" :template="selected">
          <h4 class="vp-template-select__name">{{ selected.name }}</h4>
          <p v-if="selected.description" class="vp-template-select__desc">{{ selected.description }}</p>
          <pre v-if="selected.preview" class="vp-template-select__code">{{ selected.preview }}</pre>
          <ul v-else class="vp-template-select__fields">
            <li v-for="(val, key) in selected.data" :key="String(key)">
              <strong>{{ key }}:</strong> {{ String(val) }}
            </li>
          </ul>
        </slot>
      </div>
    </template>

    <slot />
  </div>
</template>
