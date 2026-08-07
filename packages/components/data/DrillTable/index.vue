<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useTableState, type TableColumn } from '@amg-webui/utils/data-display/useTableState'
import type { DrillTableProps, DrillTableEmits } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<DrillTableProps & { columns?: TableColumn[]; rows?: Record<string, unknown>[]; drillField?: string }>(),
  { columns: () => [], rows: () => [], drillField: 'category', disabled: false }
)
const emit = defineEmits<DrillTableEmits>()
const { t } = useLocale()

const allRows = computed(() =>
  props.rows?.length ? props.rows : Array.isArray(props.data) ? (props.data as Record<string, unknown>[]) : []
)

const breadcrumbs = ref<string[]>([])
const drillField = computed(() => props.drillField)

const currentRows = computed(() => {
  let list = allRows.value
  for (const crumb of breadcrumbs.value) {
    list = list.filter((r) => String(r[drillField.value]) === crumb)
  }
  if (!breadcrumbs.value.length) {
    const groups = new Map<string, Record<string, unknown>[]>()
    for (const r of list) {
      const key = String(r[drillField.value] ?? '')
      groups.set(key, [...(groups.get(key) ?? []), r])
    }
    return [...groups.entries()].map(([key, rows]) => ({
      [drillField.value]: key,
      count: rows.length,
      _rows: rows
    }))
  }
  return list
})

const rawCols = computed<TableColumn[]>(() => {
  if (breadcrumbs.value.length && props.columns?.length) return props.columns
  return [
    { field: drillField.value, header: drillField.value },
    { field: 'count', header: t('common.value') }
  ]
})

const { visibleColumns } = useTableState(currentRows, rawCols)

function drillInto(row: Record<string, unknown>) {
  const key = String(row[drillField.value] ?? '')
  breadcrumbs.value = [...breadcrumbs.value, key]
  emit('change', row)
}

function drillUp() {
  breadcrumbs.value = breadcrumbs.value.slice(0, -1)
}

const titleText = computed(() => props.title ?? t('component.drill-table.title'))
</script>

<template>
  <div role="region" aria-label="DrillTable" :class="['vp-drill-table', 'vp-drill-table__panel', { 'vp-drill-table--disabled': disabled }, props.class]" :style="style">
    <div class="vp-drill-table__toolbar">
      <strong class="vp-drill-table__heading">{{ titleText }}</strong>
      <button v-if="breadcrumbs.length" type="button" class="vp-drill-table__control" @click="drillUp">
        {{ t('common.drillUp') }}
      </button>
    </div>
    <nav class="vp-drill-table__crumbs">
      <button
        v-for="(crumb, i) in breadcrumbs"
        :key="i"
        type="button"
        class="vp-drill-table__crumb"
        @click="breadcrumbs = breadcrumbs.slice(0, i + 1)"
      >
        {{ crumb }}
      </button>
    </nav>
    <div class="vp-drill-table__scroll">
      <table class="vp-drill-table__grid">
        <thead>
          <tr>
            <th v-for="c in visibleColumns" :key="c.field" class="vp-drill-table__head">{{ c.header }}</th>
            <th class="vp-drill-table__head">{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in currentRows" :key="i" class="vp-drill-table__row">
            <td v-for="c in visibleColumns" :key="c.field" class="vp-drill-table__cell">{{ row[c.field] }}</td>
            <td class="vp-drill-table__cell">
              <button
                v-if="!breadcrumbs.length"
                type="button"
                class="vp-drill-table__control"
                @click="drillInto(row)"
              >
                {{ t('common.drillDown') }}
              </button>
            </td>
          </tr>
          <tr v-if="!currentRows.length">
            <td :colspan="visibleColumns.length + 1" class="vp-drill-table__empty">{{ t('common.noData') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-drill-table__control {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  border-radius: var(--theme-btn-radius);
  height: var(--height-md);
  padding: 0 var(--spacing-md);
  cursor: pointer;
}
.vp-drill-table__crumbs {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}
.vp-drill-table__crumb {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--primary-500);
  cursor: pointer;
}
.vp-drill-table__scroll {
  overflow: auto;
  max-height: 20rem;
  margin-top: var(--spacing-md);
}
.vp-drill-table__grid {
  width: 100%;
  border-collapse: collapse;
}
.vp-drill-table__head,
.vp-drill-table__cell,
.vp-drill-table__empty {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
}
</style>
