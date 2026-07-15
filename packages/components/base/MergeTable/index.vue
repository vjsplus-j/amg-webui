<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useTableState, type TableColumn } from '@amg-webui/utils/data-display/useTableState'
import type { MergeTableProps, MergeTableEmits } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<MergeTableProps & { columns?: TableColumn[]; rows?: Record<string, unknown>[]; mergeField?: string }>(),
  { columns: () => [], rows: () => [], mergeField: '', disabled: false }
)
const emit = defineEmits<MergeTableEmits>()
const { t } = useLocale()

const rawRows = computed(() =>
  props.rows?.length ? props.rows : Array.isArray(props.data) ? (props.data as Record<string, unknown>[]) : []
)

const rawCols = computed<TableColumn[]>(() => {
  if (props.columns?.length) return props.columns
  const first = rawRows.value[0]
  if (!first) return []
  return Object.keys(first).map((field) => ({ field, header: field }))
})

const { visibleColumns, filteredRows } = useTableState(rawRows, rawCols)
const mergeKey = computed(() => props.mergeField || visibleColumns.value[0]?.field || '')

function spanAt(rowIndex: number): number {
  const field = mergeKey.value
  if (!field) return 1
  const rows = filteredRows.value
  const val = rows[rowIndex][field]
  if (rowIndex > 0 && rows[rowIndex - 1][field] === val) return 0
  let span = 1
  for (let i = rowIndex + 1; i < rows.length; i++) {
    if (rows[i][field] === val) span++
    else break
  }
  return span
}

const titleText = computed(() => props.title ?? t('component.merge-table.title'))
</script>

<template>
  <div :class="['vp-merge-table', 'vp-merge-table__panel', { 'vp-merge-table--disabled': disabled }, props.class]" :style="style">
    <strong class="vp-merge-table__heading">{{ titleText }}</strong>
    <div class="vp-merge-table__scroll">
      <table class="vp-merge-table__grid">
        <thead>
          <tr>
            <th v-for="c in visibleColumns" :key="c.field" class="vp-merge-table__head">{{ c.header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, ri) in filteredRows"
            :key="ri"
            class="vp-merge-table__row"
            @click="emit('change', row)"
          >
            <template v-for="c in visibleColumns" :key="c.field">
              <td
                v-if="c.field === mergeKey ? spanAt(ri) > 0 : true"
                class="vp-merge-table__cell"
                :rowspan="c.field === mergeKey ? spanAt(ri) || 1 : 1"
              >
                {{ row[c.field] }}
              </td>
            </template>
          </tr>
          <tr v-if="!filteredRows.length">
            <td :colspan="Math.max(visibleColumns.length, 1)" class="vp-merge-table__empty">{{ t('common.noData') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-merge-table__scroll {
  overflow: auto;
  max-height: 20rem;
  margin-top: var(--spacing-md);
}
.vp-merge-table__grid {
  width: 100%;
  border-collapse: collapse;
}
.vp-merge-table__head,
.vp-merge-table__cell,
.vp-merge-table__empty {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--ds-border);
  text-align: left;
}
</style>
