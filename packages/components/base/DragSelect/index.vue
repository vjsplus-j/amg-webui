<script setup lang="ts">
import { computed, ref } from 'vue'
import Checkbox from '../Checkbox/index.vue'
import type { DragSelectProps, DragSelectEmits, DragSelectItem } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragSelectProps>(), {
  modelValue: () => [],
  options: () => []
})

const emit = defineEmits<DragSelectEmits>()

const items = ref<DragSelectItem[]>([...props.options])
const dragIndex = ref<number | null>(null)

const selected = computed(() => new Set(props.modelValue ?? []))

const emitSelection = (next: (string | number)[]) => {
  emit('update:modelValue', next)
  emit('change', next)
}

const toggle = (id: string | number, checked: boolean) => {
  if (props.disabled) return
  const set = new Set(props.modelValue ?? [])
  if (checked) set.add(id)
  else set.delete(id)
  emitSelection([...set])
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
</script>

<template>
  <ul :class="['vp-drag-select', props.class, { 'vp-drag-select--disabled': disabled }]" :style="style" data-component="DragSelect">
    <li
      v-for="(item, index) in items"
      :key="String(item.id)"
      class="vp-drag-select__item"
      draggable="true"
      @dragstart="onDragStart(index)"
      @dragover="onDragOver($event, index)"
      @dragend="onDragEnd"
    >
      <span class="vp-drag-select__handle" aria-hidden="true">⋮⋮</span>
      <Checkbox
        :model-value="selected.has(item.id)"
        :disabled="disabled"
        @update:model-value="(v) => toggle(item.id, v)"
      >
        {{ item.label }}
      </Checkbox>
    </li>
  </ul>
</template>
