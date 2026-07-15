<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { PivotTableProps, PivotTableEmits } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<PivotTableProps & { rows?: Record<string, unknown>[]; rowField?: string; colField?: string; valueField?: string }>(),
  { rows: () => [], rowField: 'region', colField: 'product', valueField: 'amount', disabled: false }
)
const emit = defineEmits<PivotTableEmits>()
const { t } = useLocale()

const source = computed(() =>
  props.rows?.length ? props.rows : Array.isArray(props.data) ? (props.data as Record<string, unknown>[]) : []
)

const pivot = computed(() => {
  const rf = props.rowField
  const cf = props.colField
  const vf = props.valueField
  const rowKeys = [...new Set(source.value.map((r) => String(r[rf] ?? '')))]
  const colKeys = [...new Set(source.value.map((r) => String(r[cf] ?? '')))]
  const matrix: Record<string, Record<string, number>> = {}
  for (const r of source.value) {
    const rk = String(r[rf] ?? '')
    const ck = String(r[cf] ?? '')
    matrix[rk] ??= {}
    matrix[rk][ck] = (matrix[rk][ck] ?? 0) + Number(r[vf] ?? 0)
  }
  return { rowKeys, colKeys, matrix }
})

const titleText = computed(() => props.title ?? t('component.pivot-table.title'))
</script>

<template>
  <div :class="['vp-pivot-table', 'vp-pivot-table__panel', { 'vp-pivot-table--disabled': disabled }, props.class]" :style="style">
    <strong class="vp-pivot-table__heading">{{ titleText }}</strong>
    <div class="vp-pivot-table__scroll">
      <table class="vp-pivot-table__grid">
        <thead>
          <tr>
            <th class="vp-pivot-table__head">{{ rowField }}</th>
            <th v-for="ck in pivot.colKeys" :key="ck" class="vp-pivot-table__head">{{ ck }}</th>
            <th class="vp-pivot-table__head">{{ t('common.total') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rk in pivot.rowKeys" :key="rk" class="vp-pivot-table__row" @click="emit('change', pivot.matrix[rk])">
            <td class="vp-pivot-table__cell vp-pivot-table__cell--label">{{ rk }}</td>
            <td v-for="ck in pivot.colKeys" :key="ck" class="vp-pivot-table__cell">
              {{ pivot.matrix[rk]?.[ck] ?? 0 }}
            </td>
            <td class="vp-pivot-table__cell">
              {{ pivot.colKeys.reduce((s, ck) => s + (pivot.matrix[rk]?.[ck] ?? 0), 0) }}
            </td>
          </tr>
          <tr v-if="!pivot.rowKeys.length">
            <td class="vp-pivot-table__empty">{{ t('common.noData') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-pivot-table__scroll {
  overflow: auto;
  max-height: 20rem;
  margin-top: var(--spacing-md);
}
.vp-pivot-table__grid {
  width: 100%;
  border-collapse: collapse;
}
.vp-pivot-table__head,
.vp-pivot-table__cell,
.vp-pivot-table__empty {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--ds-border);
  text-align: right;
}
.vp-pivot-table__cell--label {
  text-align: left;
  font-weight: 600;
}
</style>
