<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { normalizeTreeNodes, type TreeNode } from '@amg-webui/utils/data-display/tree-types'
import { useTreeState, collectDescendantValues } from '@amg-webui/utils/data-display/useTreeState'
import type { TreeTransferProps, TreeTransferEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<TreeTransferProps & { options?: TreeNode[] }>(), {
  options: () => [],
  modelValue: () => [],
  disabled: false
})
const emit = defineEmits<TreeTransferEmits>()
const { t } = useLocale()

const targetKeys = ref<(string | number)[]>(Array.isArray(props.modelValue) ? [...props.modelValue] : [])

const roots = computed(() => normalizeTreeNodes(props.data, props.options))
const modelRef = toRef(props, 'modelValue')
const { searchQuery, flatRows, toggleExpand, expandAll, collapseAll } = useTreeState(
  roots,
  modelRef,
  emit as never,
  { checkable: false }
)

const leftChecked = ref<Set<string | number>>(new Set())

function toggleLeft(node: TreeNode) {
  const val = node.value ?? node.label
  const next = new Set(leftChecked.value)
  if (next.has(val)) next.delete(val)
  else next.add(val)
  leftChecked.value = next
}

function moveRight() {
  const merged = new Set([...targetKeys.value, ...leftChecked.value])
  targetKeys.value = [...merged]
  leftChecked.value = new Set()
  emit('update:modelValue', targetKeys.value)
  emit('change', targetKeys.value)
}

function moveLeft() {
  targetKeys.value = []
  emit('update:modelValue', [])
  emit('change', [])
}

function moveWithChildren(node: TreeNode) {
  const vals = collectDescendantValues(node)
  const merged = new Set([...targetKeys.value, ...vals])
  targetKeys.value = [...merged]
  emit('update:modelValue', targetKeys.value)
  emit('change', targetKeys.value)
}

const selectedLabels = computed(() => {
  const map = new Map<string | number, string>()
  flatRows.value.forEach((r) => map.set(r.node.value ?? r.node.label, r.node.label))
  return targetKeys.value.map((k) => ({ key: k, label: map.get(k) ?? String(k) }))
})

const titleText = computed(() => props.title ?? t('component.tree-transfer.title'))
</script>

<template>
  <div :class="['vp-tree-transfer', 'vp-tree-transfer__panel', { 'vp-tree-transfer--disabled': disabled }, props.class]" :style="style">
    <strong class="vp-tree-transfer__title">{{ titleText }}</strong>
    <div class="vp-tree-transfer__panes">
      <section class="vp-tree-transfer__pane">
        <div class="vp-tree-transfer__toolbar">
          <input v-model="searchQuery" class="vp-tree-transfer__search" type="search" :placeholder="t('common.search')" />
          <button type="button" class="vp-tree-transfer__action" @click="expandAll">{{ t('common.expand') }}</button>
          <button type="button" class="vp-tree-transfer__action" @click="collapseAll">{{ t('common.collapse') }}</button>
        </div>
        <ul class="vp-tree-transfer__list">
          <li
            v-for="row in flatRows"
            :key="row.id"
            class="vp-tree-transfer__row"
            :style="{ paddingLeft: `calc(${row.depth} * var(--spacing-md))` }"
          >
            <button v-if="row.hasChildren" type="button" @click="toggleExpand(row.id)">{{ row.expanded ? '-' : '+' }}</button>
            <input
              type="checkbox"
              :checked="leftChecked.has(row.node.value ?? row.node.label)"
              @change="toggleLeft(row.node)"
            />
            <span>{{ row.node.label }}</span>
            <button v-if="row.hasChildren" type="button" class="vp-tree-transfer__action" @click="moveWithChildren(row.node)">
              {{ t('common.all') }}
            </button>
          </li>
        </ul>
      </section>
      <div class="vp-tree-transfer__controls">
        <button type="button" class="vp-tree-transfer__action" :disabled="disabled" @click="moveRight">{{ t('common.next') }}</button>
        <button type="button" class="vp-tree-transfer__action" :disabled="disabled" @click="moveLeft">{{ t('common.previous') }}</button>
      </div>
      <section class="vp-tree-transfer__pane">
        <h4 class="vp-tree-transfer__subtitle">{{ t('common.value') }}</h4>
        <ul class="vp-tree-transfer__selected">
          <li v-for="item in selectedLabels" :key="String(item.key)" class="vp-tree-transfer__selected-row">
            {{ item.label }}
          </li>
          <li v-if="!selectedLabels.length" class="vp-tree-transfer__muted">{{ t('common.noData') }}</li>
        </ul>
      </section>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-tree-transfer__panes {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
  align-items: stretch;
}
.vp-tree-transfer__pane {
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  padding: var(--spacing-md);
  max-height: 20rem;
  overflow: auto;
}
.vp-tree-transfer__controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-md);
}
.vp-tree-transfer__search {
  flex: 1;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
}
.vp-tree-transfer__list,
.vp-tree-transfer__selected {
  list-style: none;
  margin: var(--spacing-md) 0 0;
  padding: 0;
}
.vp-tree-transfer__row,
.vp-tree-transfer__selected-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-height: var(--height-md);
}
.vp-tree-transfer__action {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  border-radius: var(--theme-btn-radius);
  cursor: pointer;
  padding: 0 var(--spacing-sm);
  height: var(--height-sm);
}
</style>
