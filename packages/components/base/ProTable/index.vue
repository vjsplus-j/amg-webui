<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useTableState, type TableColumn } from '@amg-webui/utils/data-display/useTableState'
import type { ProTableProps, ProTableEmits } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<ProTableProps & { columns?: TableColumn[]; rows?: Record<string, unknown>[] }>(),
  {
    columns: () => [],
    rows: () => [],
    disabled: false,
    loading: false
  }
)
const emit = defineEmits<ProTableEmits>()
const { t } = useLocale()
const tableRoot = ref<HTMLElement | null>(null)
const refreshKey = ref(0)

const rawRows = computed(() => {
  void refreshKey.value
  return props.rows?.length
    ? props.rows
    : Array.isArray(props.data)
      ? (props.data as Record<string, unknown>[])
      : []
})

const rawCols = computed<TableColumn[]>(() => {
  if (props.columns?.length) return props.columns
  const first = rawRows.value[0]
  if (!first) return []
  return Object.keys(first)
    .slice(0, 8)
    .map((field) => ({ field, header: field, sortable: true }))
})

const {
  keyword,
  sortField,
  sortDir,
  visibleColumns,
  filteredRows,
  toggleSort,
  toggleColumn,
  exportCsv,
  printTable
} = useTableState(rawRows, rawCols)

const totals = computed(() => {
  const sums: Record<string, number> = {}
  for (const col of visibleColumns.value) {
    const nums = filteredRows.value.map((r) => Number(r[col.field])).filter((n) => !Number.isNaN(n))
    if (nums.length) sums[col.field] = nums.reduce((a, b) => a + b, 0)
  }
  return sums
})

function refresh() {
  refreshKey.value++
  emit('change', filteredRows.value)
}

function onRowClick(row: Record<string, unknown>) {
  emit('update:modelValue', row)
  emit('change', row)
}

const titleText = computed(() => props.title ?? t('component.pro-table.title'))
</script>

<template>
  <div
    ref="tableRoot"
    :class="['vp-pro-table', 'vp-pro-table__panel', { 'vp-pro-table--disabled': disabled, 'vp-pro-table--loading': loading }, props.class]"
    :style="style"
  >
    <div class="vp-pro-table__toolbar">
      <strong class="vp-pro-table__heading">{{ titleText }}</strong>
      <input
        v-model="keyword"
        class="vp-pro-table__filter"
        type="search"
        :placeholder="t('common.search')"
        :disabled="disabled"
      />
      <button type="button" class="vp-pro-table__control" :disabled="disabled || loading" @click="refresh">
        {{ loading ? t('common.loading') : t('button.refresh') }}
      </button>
      <button type="button" class="vp-pro-table__control" :disabled="disabled" @click="exportCsv()">
        {{ t('common.export') }}
      </button>
      <button type="button" class="vp-pro-table__control" :disabled="disabled" @click="printTable(tableRoot)">
        {{ t('common.print') }}
      </button>
      <slot name="actions" />
    </div>
    <div class="vp-pro-table__columns">
      <span class="vp-pro-table__columns-label">{{ t('common.columns') }}:</span>
      <label v-for="c in rawCols" :key="c.field" class="vp-pro-table__col-toggle">
        <input type="checkbox" :checked="visibleColumns.some((v) => v.field === c.field)" @change="toggleColumn(c.field)" />
        {{ c.header }}
      </label>
    </div>
    <div class="vp-pro-table__scroll">
      <table class="vp-pro-table__grid">
        <thead>
          <tr>
            <th
              v-for="c in visibleColumns"
              :key="c.field"
              class="vp-pro-table__head"
              @click="c.sortable !== false && toggleSort(c.field)"
            >
              {{ c.header }}
              <span v-if="sortField === c.field" class="vp-pro-table__sort">
                {{ sortDir === 'asc' ? t('common.sortAsc') : t('common.sortDesc') }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in filteredRows"
            :key="i"
            class="vp-pro-table__row"
            @click="onRowClick(row)"
          >
            <td v-for="c in visibleColumns" :key="c.field" class="vp-pro-table__cell">
              {{ row[c.field] }}
            </td>
          </tr>
          <tr v-if="!filteredRows.length">
            <td :colspan="Math.max(visibleColumns.length, 1)" class="vp-pro-table__empty">
              {{ t('common.noData') }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="Object.keys(totals).length">
          <tr>
            <td v-for="c in visibleColumns" :key="c.field" class="vp-pro-table__foot">
              {{ totals[c.field] != null ? totals[c.field] : '' }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <p class="vp-pro-table__meta">{{ filteredRows.length }} {{ t('common.rows') }}</p>
    <slot />
  </div>
</template>

<style scoped>
.vp-pro-table__filter {
  flex: 1;
  min-width: 8rem;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
  background: var(--surface-0);
  color: var(--text-primary);
}
.vp-pro-table__control {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  color: var(--text-primary);
  border-radius: var(--theme-btn-radius);
  height: var(--height-md);
  padding: 0 var(--spacing-md);
  cursor: pointer;
}
.vp-pro-table__columns {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
}
.vp-pro-table__col-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}
.vp-pro-table__scroll {
  overflow: auto;
  max-height: 20rem;
  margin-top: var(--spacing-md);
}
.vp-pro-table__grid {
  width: 100%;
  border-collapse: collapse;
}
.vp-pro-table__head {
  text-align: left;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
  position: sticky;
  top: 0;
  background: var(--surface-1);
  cursor: pointer;
  font-size: var(--font-size-sm);
}
.vp-pro-table__cell,
.vp-pro-table__foot,
.vp-pro-table__empty {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
  font-size: var(--font-size-md);
}
.vp-pro-table__row:hover {
  background: var(--surface-2);
}
.vp-pro-table__sort {
  color: var(--primary-500);
  margin-left: var(--spacing-xs);
  font-size: var(--font-size-xs);
}
.vp-pro-table__meta {
  margin: var(--spacing-sm) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
</style>
