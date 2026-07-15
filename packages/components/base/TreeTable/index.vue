<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { TreeTableProps, TreeTableEmits } from './types'
import './style.scss'

interface TreeRow {
  id: string | number
  label: string
  value?: unknown
  children?: TreeRow[]
  [key: string]: unknown
}

const props = withDefaults(defineProps<TreeTableProps & { rows?: TreeRow[] }>(), {
  rows: () => [],
  disabled: false
})
const emit = defineEmits<TreeTableEmits>()
const { t } = useLocale()
const expanded = ref<Set<string | number>>(new Set())
const keyword = ref('')

const source = computed<TreeRow[]>(() => {
  if (props.rows?.length) return props.rows
  if (Array.isArray(props.data)) return props.data as TreeRow[]
  return []
})

interface FlatRow { row: TreeRow; depth: number; hasChildren: boolean }

function flatten(nodes: TreeRow[], depth = 0): FlatRow[] {
  const out: FlatRow[] = []
  for (const n of nodes) {
    const hasChildren = Boolean(n.children?.length)
    out.push({ row: n, depth, hasChildren })
    if (hasChildren && expanded.value.has(n.id)) {
      out.push(...flatten(n.children!, depth + 1))
    }
  }
  return out
}

const flat = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  const all = flatten(source.value)
  if (!kw) return all
  return all.filter((f) => JSON.stringify(f.row).toLowerCase().includes(kw))
})

function toggle(id: string | number) {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}

function onRowClick(row: TreeRow) {
  emit('update:modelValue', row)
  emit('change', row)
}

const titleText = computed(() => props.title ?? t('component.tree-table.title'))
</script>

<template>
  <div :class="['vp-tree-table', 'vp-tree-table__panel', { 'vp-tree-table--disabled': disabled }, props.class]" :style="style">
    <div class="vp-tree-table__toolbar">
      <strong class="vp-tree-table__heading">{{ titleText }}</strong>
      <input v-model="keyword" class="vp-tree-table__filter" type="search" :placeholder="t('common.search')" />
    </div>
    <div class="vp-tree-table__scroll">
      <table class="vp-tree-table__grid">
        <thead>
          <tr>
            <th class="vp-tree-table__head">{{ t('common.value') }}</th>
            <th class="vp-tree-table__head">{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(f, i) in flat" :key="i" class="vp-tree-table__row" @click="onRowClick(f.row)">
            <td class="vp-tree-table__cell" :style="{ paddingLeft: `calc(${f.depth} * var(--spacing-lg) + var(--spacing-md))` }">
              <button v-if="f.hasChildren" type="button" class="vp-tree-table__toggle" @click.stop="toggle(f.row.id)">
                {{ expanded.has(f.row.id) ? '-' : '+' }}
              </button>
              {{ f.row.label }}
            </td>
            <td class="vp-tree-table__cell">
              <slot name="actions" :row="f.row" />
            </td>
          </tr>
          <tr v-if="!flat.length">
            <td colspan="2" class="vp-tree-table__empty">{{ t('common.noData') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-tree-table__filter {
  flex: 1;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
}
.vp-tree-table__scroll {
  overflow: auto;
  max-height: 20rem;
  margin-top: var(--spacing-md);
}
.vp-tree-table__grid {
  width: 100%;
  border-collapse: collapse;
}
.vp-tree-table__head,
.vp-tree-table__cell,
.vp-tree-table__empty {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
  text-align: left;
}
.vp-tree-table__toggle {
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  margin-right: var(--spacing-sm);
}
</style>
