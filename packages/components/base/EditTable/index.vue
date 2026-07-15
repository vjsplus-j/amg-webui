<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useTableState, type TableColumn } from '@amg-webui/utils/data-display/useTableState'
import type { EditTableProps, EditTableEmits } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<EditTableProps & { columns?: TableColumn[]; rows?: Record<string, unknown>[] }>(),
  { columns: () => [], rows: () => [], disabled: false }
)
const emit = defineEmits<EditTableEmits>()
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

const { keyword, visibleColumns, filteredRows } = useTableState(localRows, rawCols)
const editing = ref<{ row: number; field: string } | null>(null)
const draft = ref('')

function startEdit(rowIndex: number, field: string, value: unknown) {
  editing.value = { row: rowIndex, field }
  draft.value = String(value ?? '')
}

function commitEdit(row: Record<string, unknown>, field: string) {
  row[field] = draft.value
  editing.value = null
  emit('change', localRows.value)
}

function cancelEdit() {
  editing.value = null
}

const titleText = computed(() => props.title ?? t('component.edit-table.title'))
</script>

<template>
  <div :class="['vp-edit-table', 'vp-edit-table__panel', { 'vp-edit-table--disabled': disabled }, props.class]" :style="style">
    <div class="vp-edit-table__toolbar">
      <strong class="vp-edit-table__heading">{{ titleText }}</strong>
      <input v-model="keyword" class="vp-edit-table__filter" type="search" :placeholder="t('common.search')" />
    </div>
    <div class="vp-edit-table__scroll">
      <table class="vp-edit-table__grid">
        <thead>
          <tr>
            <th v-for="c in visibleColumns" :key="c.field" class="vp-edit-table__head">{{ c.header }}</th>
            <th class="vp-edit-table__head">{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, ri) in filteredRows" :key="ri" class="vp-edit-table__row">
            <td v-for="c in visibleColumns" :key="c.field" class="vp-edit-table__cell">
              <input
                v-if="editing?.row === ri && editing?.field === c.field"
                v-model="draft"
                class="vp-edit-table__input"
                @keyup.enter="commitEdit(row, c.field)"
              />
              <span v-else>{{ row[c.field] }}</span>
            </td>
            <td class="vp-edit-table__cell">
              <button
                v-for="c in visibleColumns"
                :key="c.field + '-edit'"
                type="button"
                class="vp-edit-table__control"
                @click="startEdit(ri, c.field, row[c.field])"
              >
                {{ t('button.edit') }}
              </button>
              <button v-if="editing?.row === ri" type="button" class="vp-edit-table__control" @click="commitEdit(row, editing!.field)">
                {{ t('button.save') }}
              </button>
              <button v-if="editing?.row === ri" type="button" class="vp-edit-table__control" @click="cancelEdit">
                {{ t('button.cancel') }}
              </button>
            </td>
          </tr>
          <tr v-if="!filteredRows.length">
            <td :colspan="visibleColumns.length + 1" class="vp-edit-table__empty">{{ t('common.noData') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-edit-table__filter,
.vp-edit-table__input {
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
}
.vp-edit-table__filter {
  flex: 1;
}
.vp-edit-table__scroll {
  overflow: auto;
  max-height: 20rem;
  margin-top: var(--spacing-md);
}
.vp-edit-table__grid {
  width: 100%;
  border-collapse: collapse;
}
.vp-edit-table__head,
.vp-edit-table__cell,
.vp-edit-table__empty {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
}
.vp-edit-table__control {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  border-radius: var(--theme-btn-radius);
  padding: 0 var(--spacing-sm);
  height: var(--height-sm);
  cursor: pointer;
  margin-right: var(--spacing-xs);
}
</style>
