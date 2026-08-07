<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { normalizeTreeNodes, type TreeNode } from '@amg-webui/utils/data-display/tree-types'
import { useTreeState } from '@amg-webui/utils/data-display/useTreeState'
import type { TransferTreeProps, TransferTreeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<TransferTreeProps & { options?: TreeNode[] }>(), {
  options: () => [],
  modelValue: () => [],
  disabled: false
})
const emit = defineEmits<TransferTreeEmits>()
const { t } = useLocale()

const roots = computed(() => normalizeTreeNodes(props.data, props.options))
const modelRef = toRef(props, 'modelValue')
const { searchQuery, flatRows, checkedSet, toggleExpand, toggleCheck, expandAll, collapseAll } = useTreeState(
  roots,
  modelRef,
  emit as never,
  { checkable: true }
)

const selected = computed(() => {
  const set = new Set(Array.isArray(props.modelValue) ? props.modelValue : [])
  return flatRows.value
    .map((r) => r.node)
    .filter((n) => set.has(n.value ?? n.label))
})

function removeSelected(val: string | number) {
  const next = (Array.isArray(props.modelValue) ? props.modelValue : []).filter((v) => v !== val)
  emit('update:modelValue', next)
  emit('change', next)
}

const titleText = computed(() => props.title ?? t('component.transfer-tree.title'))
</script>

<template>
  <div role="region" aria-label="TransferTree" :class="['vp-transfer-tree', 'vp-transfer-tree__panel', { 'vp-transfer-tree--disabled': disabled }, props.class]" :style="style">
    <strong class="vp-transfer-tree__title">{{ titleText }}</strong>
    <div class="vp-transfer-tree__panes">
      <section class="vp-transfer-tree__pane">
        <div class="vp-transfer-tree__toolbar">
          <input v-model="searchQuery" class="vp-transfer-tree__search" type="search" :placeholder="t('common.search')" />
          <button type="button" class="vp-transfer-tree__action" @click="expandAll">{{ t('common.expand') }}</button>
          <button type="button" class="vp-transfer-tree__action" @click="collapseAll">{{ t('common.collapse') }}</button>
        </div>
        <ul class="vp-transfer-tree__list">
          <li
            v-for="row in flatRows"
            :key="row.id"
            class="vp-transfer-tree__row"
            :style="{ paddingLeft: `calc(${row.depth} * var(--spacing-md))` }"
          >
            <button v-if="row.hasChildren" type="button" class="vp-transfer-tree__toggle" @click="toggleExpand(row.id)">
              {{ row.expanded ? '-' : '+' }}
            </button>
            <input
              type="checkbox"
              :checked="checkedSet.has(row.node.value ?? row.node.label)"
              @change="toggleCheck(row.node)"
            />
            <span>{{ row.node.label }}</span>
          </li>
        </ul>
      </section>
      <section class="vp-transfer-tree__pane">
        <h4 class="vp-transfer-tree__subtitle">{{ t('common.selectAll') }}</h4>
        <ul class="vp-transfer-tree__selected">
          <li v-for="n in selected" :key="String(n.value ?? n.label)" class="vp-transfer-tree__selected-row">
            <span>{{ n.label }}</span>
            <button type="button" class="vp-transfer-tree__action" @click="removeSelected(n.value ?? n.label)">
              {{ t('common.close') }}
            </button>
          </li>
          <li v-if="!selected.length" class="vp-transfer-tree__muted">{{ t('common.noData') }}</li>
        </ul>
      </section>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-transfer-tree__panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}
.vp-transfer-tree__pane {
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  padding: var(--spacing-md);
  min-height: 12rem;
  max-height: 20rem;
  overflow: auto;
}
.vp-transfer-tree__search {
  flex: 1;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
}
.vp-transfer-tree__list,
.vp-transfer-tree__selected {
  list-style: none;
  margin: var(--spacing-md) 0 0;
  padding: 0;
}
.vp-transfer-tree__row,
.vp-transfer-tree__selected-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-height: var(--height-md);
}
.vp-transfer-tree__toggle,
.vp-transfer-tree__action {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  border-radius: var(--theme-btn-radius);
  cursor: pointer;
  padding: 0 var(--spacing-sm);
  height: var(--height-sm);
}
</style>
