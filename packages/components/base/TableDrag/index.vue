<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useTableState, type TableColumn } from '@amg-webui/utils/data-display/useTableState'
import type { TableDragProps, TableDragEmits } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<TableDragProps & { columns?: TableColumn[]; rows?: Record<string, unknown>[] }>(),
  { columns: () => [], rows: () => [], disabled: false }
)
const emit = defineEmits<TableDragEmits>()
const { t } = useLocale()

const localRows = ref<Record<string, unknown>[]>(
  props.rows?.length ? [...props.rows] : Array.isArray(props.data) ? [...(props.data as Record<string, unknown>[])] : []
)

const rawCols = computed<TableColumn[]>(() => {
  if (props.columns?.length) return props.columns
  const first = localRows.value[0]
  if (!first) return []
  return Object.keys(first).map((field) => ({ field, header: field }))
})

const { visibleColumns } = useTableState(localRows, rawCols)
const dragIndex = ref<number | null>(null)
const overIndex = ref<number | null>(null)

function onDragStart(i: number) {
  if (props.disabled) return
  dragIndex.value = i
}

function onDragOver(i: number, e: DragEvent) {
  e.preventDefault()
  overIndex.value = i
}

function onDrop(i: number) {
  if (dragIndex.value == null || dragIndex.value === i) return
  const list = [...localRows.value]
  const [item] = list.splice(dragIndex.value, 1)
  list.splice(i, 0, item)
  localRows.value = list
  dragIndex.value = null
  overIndex.value = null
  emit('change', list)
}

const titleText = computed(() => props.title ?? t('component.table-drag.title'))
</script>

<template>
  <div :class="['vp-table-drag', 'vp-table-drag__panel', { 'vp-table-drag--disabled': disabled }, props.class]" :style="style">
    <strong class="vp-table-drag__heading">{{ titleText }}</strong>
    <div class="vp-table-drag__scroll">
      <table class="vp-table-drag__grid">
        <thead>
          <tr>
            <th class="vp-table-drag__head" />
            <th v-for="c in visibleColumns" :key="c.field" class="vp-table-drag__head">{{ c.header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in localRows"
            :key="i"
            class="vp-table-drag__row"
            :class="{ 'vp-table-drag__row--over': overIndex === i }"
            draggable="true"
            @dragstart="onDragStart(i)"
            @dragover="onDragOver(i, $event)"
            @drop="onDrop(i)"
          >
            <td class="vp-table-drag__handle">⋮⋮</td>
            <td v-for="c in visibleColumns" :key="c.field" class="vp-table-drag__cell">{{ row[c.field] }}</td>
          </tr>
          <tr v-if="!localRows.length">
            <td :colspan="visibleColumns.length + 1" class="vp-table-drag__empty">{{ t('common.noData') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-table-drag__scroll {
  overflow: auto;
  max-height: 20rem;
  margin-top: var(--spacing-md);
}
.vp-table-drag__grid {
  width: 100%;
  border-collapse: collapse;
}
.vp-table-drag__head,
.vp-table-drag__cell,
.vp-table-drag__empty,
.vp-table-drag__handle {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
}
.vp-table-drag__row {
  cursor: grab;
}
.vp-table-drag__row--over {
  background: var(--surface-2);
}
.vp-table-drag__handle {
  color: var(--text-secondary);
  width: 2rem;
  text-align: center;
}
</style>
