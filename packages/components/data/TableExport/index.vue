<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useTableState, type TableColumn } from '@amg-webui/utils/data-display/useTableState'
import type { TableExportProps, TableExportEmits } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<TableExportProps & { columns?: TableColumn[]; rows?: Record<string, unknown>[] }>(),
  { columns: () => [], rows: () => [], disabled: false }
)
const emit = defineEmits<TableExportEmits>()
const { t } = useLocale()
const selected = ref<Set<number>>(new Set())

const rawRows = computed(() =>
  props.rows?.length ? props.rows : Array.isArray(props.data) ? (props.data as Record<string, unknown>[]) : []
)

const rawCols = computed<TableColumn[]>(() => {
  if (props.columns?.length) return props.columns
  const first = rawRows.value[0]
  if (!first) return []
  return Object.keys(first).map((field) => ({ field, header: field }))
})

const { keyword, visibleColumns, filteredRows, exportCsv } = useTableState(rawRows, rawCols)

function toggleRow(i: number) {
  const next = new Set(selected.value)
  if (next.has(i)) next.delete(i)
  else next.add(i)
  selected.value = next
}

function exportSelected() {
  const rows = filteredRows.value.filter((_, i) => selected.value.has(i))
  const cols = visibleColumns.value
  const header = cols.map((c) => c.header).join(',')
  const body = rows.map((row) => cols.map((c) => `"${String(row[c.field] ?? '')}"`).join(',')).join('\n')
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'selected.csv'
  a.click()
  URL.revokeObjectURL(url)
  emit('change', rows)
}

const titleText = computed(() => props.title ?? t('component.table-export.title'))
</script>

<template>
  <div role="region" aria-label="TableExport" :class="['vp-table-export', 'vp-table-export__panel', { 'vp-table-export--disabled': disabled }, props.class]" :style="style">
    <div class="vp-table-export__toolbar">
      <strong class="vp-table-export__heading">{{ titleText }}</strong>
      <input v-model="keyword" class="vp-table-export__filter" type="search" :placeholder="t('common.search')" />
      <button type="button" class="vp-table-export__control" :disabled="disabled" @click="exportCsv()">
        {{ t('common.export') }}
      </button>
      <button type="button" class="vp-table-export__control" :disabled="disabled || !selected.size" @click="exportSelected">
        {{ t('common.selectAll') }}
      </button>
    </div>
    <div class="vp-table-export__scroll">
      <table class="vp-table-export__grid">
        <thead>
          <tr>
            <th class="vp-table-export__head" />
            <th v-for="c in visibleColumns" :key="c.field" class="vp-table-export__head">{{ c.header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in filteredRows" :key="i" class="vp-table-export__row">
            <td class="vp-table-export__cell">
              <input type="checkbox" :checked="selected.has(i)" @change="toggleRow(i)" />
            </td>
            <td v-for="c in visibleColumns" :key="c.field" class="vp-table-export__cell">{{ row[c.field] }}</td>
          </tr>
          <tr v-if="!filteredRows.length">
            <td :colspan="visibleColumns.length + 1" class="vp-table-export__empty">{{ t('common.noData') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-table-export__filter {
  flex: 1;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
}
.vp-table-export__control {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  border-radius: var(--theme-btn-radius);
  height: var(--height-md);
  padding: 0 var(--spacing-md);
  cursor: pointer;
}
.vp-table-export__scroll {
  overflow: auto;
  max-height: 20rem;
  margin-top: var(--spacing-md);
}
.vp-table-export__grid {
  width: 100%;
  border-collapse: collapse;
}
.vp-table-export__head,
.vp-table-export__cell,
.vp-table-export__empty {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
}
</style>
