<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useTableState, type TableColumn } from '@amg-webui/utils/data-display/useTableState'
import type { TableActionProps, TableActionEmits } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<TableActionProps & { columns?: TableColumn[]; rows?: Record<string, unknown>[]; actions?: string[] }>(),
  {
    columns: () => [],
    rows: () => [],
    actions: () => ['edit', 'delete'],
    disabled: false
  }
)
const emit = defineEmits<TableActionEmits & { (e: 'action', payload: { action: string; row: Record<string, unknown> }): void }>()
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

const actionLabels: Record<string, string> = {
  edit: t('button.edit'),
  delete: t('button.delete'),
  view: t('button.confirm')
}

function runAction(action: string, row: Record<string, unknown>) {
  if (props.disabled) return
  emit('action', { action, row })
  emit('change', { action, row })
}

const titleText = computed(() => props.title ?? t('component.table-action.title'))
</script>

<template>
  <div role="region" aria-label="TableAction" :class="['vp-table-action', 'vp-table-action__panel', { 'vp-table-action--disabled': disabled }, props.class]" :style="style">
    <strong class="vp-table-action__heading">{{ titleText }}</strong>
    <div class="vp-table-action__scroll">
      <table class="vp-table-action__grid">
        <thead>
          <tr>
            <th v-for="c in visibleColumns" :key="c.field" class="vp-table-action__head">{{ c.header }}</th>
            <th class="vp-table-action__head">{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in filteredRows" :key="i" class="vp-table-action__row">
            <td v-for="c in visibleColumns" :key="c.field" class="vp-table-action__cell">{{ row[c.field] }}</td>
            <td class="vp-table-action__cell">
              <button
                v-for="act in actions"
                :key="act"
                type="button"
                class="vp-table-action__control"
                :disabled="disabled"
                @click="runAction(act, row)"
              >
                {{ actionLabels[act] ?? act }}
              </button>
              <slot name="actions" :row="row" />
            </td>
          </tr>
          <tr v-if="!filteredRows.length">
            <td :colspan="visibleColumns.length + 1" class="vp-table-action__empty">{{ t('common.noData') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-table-action__scroll {
  overflow: auto;
  max-height: 20rem;
  margin-top: var(--spacing-md);
}
.vp-table-action__grid {
  width: 100%;
  border-collapse: collapse;
}
.vp-table-action__head,
.vp-table-action__cell,
.vp-table-action__empty {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
}
.vp-table-action__control {
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
