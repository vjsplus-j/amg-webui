<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { useTableState, type TableColumn } from '@amg-webui/utils/data-display/useTableState'
import { useVirtualList } from '@amg-webui/utils/data-display/useVirtualList'
import type { VirtualTableProps, VirtualTableEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VirtualTableProps>(), {
  columns: () => [],
  rows: () => [],
  virtual: true,
  disabled: false,
  loading: false,
  telemetry: undefined
})
const emit = defineEmits<VirtualTableEmits>()
const { t } = useLocale()

const rawRows = computed(() =>
  props.rows?.length ? props.rows : Array.isArray(props.data) ? props.data : []
)

const rawCols = computed<TableColumn[]>(() => {
  if (props.columns?.length) return props.columns
  const first = rawRows.value[0]
  if (!first) return []
  return Object.keys(first).slice(0, 8).map((field) => ({ field, header: field, sortable: true }))
})

const { keyword, sortField, sortDir, visibleColumns, filteredRows, toggleSort, exportCsv } = useTableState(
  rawRows,
  rawCols
)

const rowRef = computed(() => filteredRows.value)
const { visibleItems, totalHeight, offsetY, itemHeight, onScroll } = useVirtualList(rowRef, {
  containerHeight: 320,
  itemHeight: 40
})

function onRowClick(row: Record<string, unknown>) {
  emit('update:modelValue', row)
  emit('change', row)
}

const titleText = computed(() => props.title ?? t('component.virtual-table.title'))
</script>

<template>
  <div
    :class="['vp-virtual-table', 'vp-virtual-table__panel', { 'vp-virtual-table--disabled': disabled }, props.class]"
    :style="style"
  >
    <div v-if="loading" class="vp-virtual-table__loading" :aria-label="t(LocaleKeys.common.loading)">
      <slot name="loading">
        <span class="vp-virtual-table__spinner" aria-hidden="true" />
      </slot>
    </div>

    <div class="vp-virtual-table__toolbar">
      <strong class="vp-virtual-table__heading">{{ titleText }}</strong>
      <input v-model="keyword" class="vp-virtual-table__filter" type="search" :placeholder="t('common.search')" />
      <button type="button" class="vp-virtual-table__control" @click="exportCsv()">{{ t('common.export') }}</button>
    </div>
    <div class="vp-virtual-table__scroll">
      <table class="vp-virtual-table__grid">
        <thead>
          <tr>
            <th
              v-for="c in visibleColumns"
              :key="c.field"
              class="vp-virtual-table__head"
              @click="c.sortable !== false && toggleSort(c.field)"
            >
              {{ c.header }}
              <span v-if="sortField === c.field" class="vp-virtual-table__sort">
                {{ sortDir === 'asc' ? t('common.sortAsc') : t('common.sortDesc') }}
              </span>
            </th>
          </tr>
        </thead>
      </table>
      <div class="vp-virtual-table__body" @scroll="onScroll">
        <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
          <table class="vp-virtual-table__grid" :style="{ transform: `translateY(${offsetY}px)` }">
            <tbody>
              <template v-if="virtual">
                <tr
                  v-for="{ item: row, index } in visibleItems"
                  :key="index"
                  class="vp-virtual-table__row"
                  :style="{ height: `${itemHeight}px` }"
                  @click="onRowClick(row)"
                >
                  <td v-for="c in visibleColumns" :key="c.field" class="vp-virtual-table__cell">
                    {{ row[c.field] }}
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(row, i) in filteredRows" :key="i" class="vp-virtual-table__row" @click="onRowClick(row)">
                  <td v-for="c in visibleColumns" :key="c.field" class="vp-virtual-table__cell">{{ row[c.field] }}</td>
                </tr>
              </template>
              <tr v-if="!filteredRows.length">
                <td :colspan="Math.max(visibleColumns.length, 1)" class="vp-virtual-table__empty">
                  <slot name="empty">{{ t('common.noData') }}</slot>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <p class="vp-virtual-table__meta">{{ filteredRows.length }} {{ t('common.rows') }}</p>
    <slot />
  </div>
</template>

<style scoped>
.vp-virtual-table__filter {
  flex: 1;
  min-width: 8rem;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
  background: var(--surface-0);
  color: var(--text-primary);
}
.vp-virtual-table__control {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  border-radius: var(--theme-btn-radius);
  height: var(--height-md);
  padding: 0 var(--spacing-md);
  cursor: pointer;
}
.vp-virtual-table__scroll {
  margin-top: var(--spacing-md);
}
.vp-virtual-table__body {
  overflow: auto;
  max-height: 20rem;
}
.vp-virtual-table__grid {
  width: 100%;
  border-collapse: collapse;
}
.vp-virtual-table__head {
  text-align: left;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
  background: var(--surface-1);
  cursor: pointer;
}
.vp-virtual-table__cell,
.vp-virtual-table__empty {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
}
.vp-virtual-table__row:hover {
  background: var(--surface-2);
}
.vp-virtual-table__meta {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
</style>
