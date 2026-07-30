<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import Checkbox from '../Checkbox/index.vue'
import Button from '../Button/index.vue'
import type { DragSelectProps, DragSelectEmits, DragSelectItem } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragSelectProps>(), {
  modelValue: () => [],
  options: () => [],
  clearable: true,
  telemetry: undefined
})

const emit = defineEmits<DragSelectEmits>()
const { t } = useLocale()

const items = ref<DragSelectItem[]>([...props.options])
const dragIndex = ref<number | null>(null)
const focusIndex = ref(0)

watch(
  () => props.options,
  (next) => {
    items.value = [...next]
  },
  { deep: true }
)

const selected = computed(() => new Set(props.modelValue ?? []))
const hasSelection = computed(() => (props.modelValue?.length ?? 0) > 0)

const emitSelection = (next: (string | number)[]) => {
  emit('update:modelValue', next)
  emit('change', next)
  trackEmit({
    component: 'DragSelect',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { count: next.length }
  })
}

const isItemDisabled = (item: DragSelectItem) => props.disabled || !!item.disabled

const toggle = (id: string | number, checked: boolean) => {
  const item = items.value.find((i) => i.id === id)
  if (!item || isItemDisabled(item)) return
  const set = new Set(props.modelValue ?? [])
  if (checked) set.add(id)
  else set.delete(id)
  emitSelection([...set])
}

const clearSelection = () => {
  emitSelection([])
  emit('clear')
  trackEmit({
    component: 'DragSelect',
    type: 'clear',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
}

const onDragStart = (index: number) => {
  if (props.disabled) return
  dragIndex.value = index
}

const onDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (props.disabled || dragIndex.value == null || dragIndex.value === index) return
  const list = [...items.value]
  const [moved] = list.splice(dragIndex.value, 1)
  list.splice(index, 0, moved)
  items.value = list
  dragIndex.value = index
  emit('reorder', list)
}

const onDragEnd = () => {
  dragIndex.value = null
}

const onItemKeydown = (event: KeyboardEvent, index: number, item: DragSelectItem) => {
  if (isItemDisabled(item)) return
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    toggle(item.id, !selected.value.has(item.id))
    return
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusIndex.value = Math.min(index + 1, items.value.length - 1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusIndex.value = Math.max(index - 1, 0)
  }
}
</script>

<template>
  <div
    :class="['vp-drag-select', props.class, { 'vp-drag-select--disabled': disabled }]"
    :style="style"
    data-component="DragSelect"
  >
    <div v-if="clearable && hasSelection" class="vp-drag-select__toolbar">
      <span class="vp-drag-select__count">
        {{ t(LocaleKeys.component.dragSelect.selected, { count: modelValue?.length ?? 0 }) }}
      </span>
      <Button
        variant="text"
        size="sm"
        :label="t(LocaleKeys.component.dragSelect.clear)"
        :disabled="disabled"
        @click="clearSelection"
      />
    </div>

    <ul
      class="vp-drag-select__list"
      role="listbox"
      :aria-label="t(LocaleKeys.component.dragSelect.listAria)"
      aria-multiselectable="true"
    >
      <li
        v-for="(item, index) in items"
        :key="String(item.id)"
        :class="[
          'vp-drag-select__item',
          {
            'vp-drag-select__item--dragging': dragIndex === index,
            'vp-drag-select__item--selected': selected.has(item.id),
            'vp-drag-select__item--disabled': isItemDisabled(item)
          }
        ]"
        role="option"
        :aria-selected="selected.has(item.id)"
        :tabindex="focusIndex === index && !isItemDisabled(item) ? 0 : -1"
        :draggable="!disabled && !item.disabled"
        @dragstart="onDragStart(index)"
        @dragover="onDragOver($event, index)"
        @dragend="onDragEnd"
        @keydown="onItemKeydown($event, index, item)"
        @focus="focusIndex = index"
      >
        <span
          class="vp-drag-select__handle"
          :aria-label="t(LocaleKeys.component.dragSelect.handleAria)"
          aria-hidden="true"
        >
          ⋮⋮
        </span>
        <Checkbox
          :model-value="selected.has(item.id)"
          :disabled="isItemDisabled(item)"
          @update:model-value="(v) => toggle(item.id, v)"
        >
          {{ item.label }}
        </Checkbox>
      </li>
    </ul>
  </div>
</template>
