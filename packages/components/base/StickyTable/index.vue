<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useTableState, type TableColumn } from '@amg-webui/utils/data-display/useTableState'
import type { StickyTableProps, StickyTableEmits } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<StickyTableProps & { columns?: TableColumn[]; rows?: Record<string, unknown>[] }>(),
  { columns: () => [], rows: () => [], disabled: false }
)
const emit = defineEmits<StickyTableEmits>()
const { t } = useLocale()

const rawRows = computed(() =>
  props.rows?.length ? props.rows : Array.isArray(props.data) ? (props.data as Record<string, unknown>[]) : []
)

const rawCols = computed<TableColumn[]>(() => {
  if (props.columns?.length) return props.columns
  const first = rawRows.value[0]
  if (!first) return []
  return Object.keys(first).map((field, i) => ({ field, header: field, sticky: i === 0 }))
})

const { keyword, visibleColumns, filteredRows, toggleSort, sortField, sortDir } = useTableState(rawRows, rawCols)

const titleText = computed(() => props.title ?? t('component.sticky-table.title'))
</script>

<template>
  <div :class="['vp-sticky-table', 'vp-sticky-table__panel', { 'vp-sticky-table--disabled': disabled }, props.class]" :style="style">
    <div class="vp-sticky-table__toolbar">
      <strong class="vp-sticky-table__heading">{{ titleText }}</strong>
      <input v-model="keyword" class="vp-sticky-table__filter" type="search" :placeholder="t('common.search')" />
    </div>
    <div class="vp-sticky-table__scroll">
      <table class="vp-sticky-table__grid">
        <thead>
          <tr>
            <th
              v-for="(c, ci) in visibleColumns"
              :key="c.field"
              class="vp-sticky-table__head"
              :class="{ 'vp-sticky-table__head--sticky': c.sticky || ci === 0 }"
              @click="toggleSort(c.field)"
            >
              {{ c.header }}
              <span v-if="sortField === c.field">{{ sortDir === 'asc' ? '^' : 'v' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in filteredRows" :key="i" class="vp-sticky-table__row" @click="emit('change', row)">
            <td
              v-for="(c, ci) in visibleColumns"
              :key="c.field"
              class="vp-sticky-table__cell"
              :class="{ 'vp-sticky-table__cell--sticky': c.sticky || ci === 0 }"
            >
              {{ row[c.field] }}
            </td>
          </tr>
          <tr v-if="!filteredRows.length">
            <td :colspan="Math.max(visibleColumns.length, 1)" class="vp-sticky-table__empty">{{ t('common.noData') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-sticky-table__filter {
  flex: 1;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
}
.vp-sticky-table__scroll {
  overflow: auto;
  max-height: 24rem;
  margin-top: var(--spacing-md);
}
.vp-sticky-table__grid {
  width: 100%;
  border-collapse: collapse;
}
.vp-sticky-table__head {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
  background: var(--surface-1);
  position: sticky;
  top: 0;
  z-index: 2;
  cursor: pointer;
}
.vp-sticky-table__head--sticky,
.vp-sticky-table__cell--sticky {
  position: sticky;
  left: 0;
  z-index: 1;
  background: var(--surface-1);
}
.vp-sticky-table__cell,
.vp-sticky-table__empty {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
  white-space: nowrap;
}
</style>
