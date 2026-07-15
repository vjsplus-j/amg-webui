<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { normalizeTreeNodes, type TreeNode } from '@amg-webui/utils/data-display/tree-types'
import { useTreeState } from '@amg-webui/utils/data-display/useTreeState'
import type { TreeProps, TreeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<TreeProps & { options?: TreeNode[]; checkable?: boolean }>(), {
  options: () => [],
  checkable: true,
  disabled: false,
  loading: false
})
const emit = defineEmits<TreeEmits>()
const { t } = useLocale()

const roots = computed(() => normalizeTreeNodes(props.data, props.options))
const modelRef = toRef(props, 'modelValue')
const {
  searchQuery,
  flatRows,
  checkedSet,
  activeId,
  toggleExpand,
  toggleCheck,
  selectNode,
  expandAll,
  collapseAll
} = useTreeState(roots, modelRef, emit as (e: 'update:modelValue' | 'change', v: unknown) => void, { checkable: props.checkable })

const titleText = computed(() => props.title ?? t('component.tree.title'))
</script>

<template>
  <div
    :class="['vp-tree', 'vp-tree__panel', { 'vp-tree--disabled': disabled, 'vp-tree--loading': loading }, props.class]"
    :style="style"
  >
    <div class="vp-tree__toolbar">
      <strong class="vp-tree__title">{{ titleText }}</strong>
      <input
        v-model="searchQuery"
        class="vp-tree__search"
        type="search"
        :placeholder="t('common.search')"
        :disabled="disabled"
      />
      <button type="button" class="vp-tree__action" :disabled="disabled" @click="expandAll">
        {{ t('common.expand') }}
      </button>
      <button type="button" class="vp-tree__action" :disabled="disabled" @click="collapseAll">
        {{ t('common.collapse') }}
      </button>
    </div>
    <div class="vp-tree__viewport">
      <ul v-if="flatRows.length" class="vp-tree__list">
        <li
          v-for="row in flatRows"
          :key="row.id"
          class="vp-tree__row"
          :class="{ 'vp-tree__row--active': activeId === row.id }"
          :style="{ paddingLeft: `calc(${row.depth} * var(--spacing-lg))` }"
        >
          <button
            v-if="row.hasChildren"
            type="button"
            class="vp-tree__toggle"
            :aria-label="row.expanded ? t('common.collapse') : t('common.expand')"
            :disabled="disabled"
            @click="toggleExpand(row.id)"
          >
            {{ row.expanded ? '-' : '+' }}
          </button>
          <span v-else class="vp-tree__indent" />
          <input
            v-if="checkable"
            type="checkbox"
            :disabled="disabled || row.node.disabled"
            :checked="checkedSet.has(row.node.value ?? row.node.label)"
            @change="toggleCheck(row.node)"
          />
          <button
            type="button"
            class="vp-tree__label"
            :disabled="disabled || row.node.disabled"
            @click="selectNode(row.id, row.node)"
          >
            {{ row.node.label }}
          </button>
        </li>
      </ul>
      <p v-else class="vp-tree__muted">{{ t('common.noData') }}</p>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-tree__search {
  flex: 1;
  min-width: 8rem;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
  background: var(--surface-0);
  color: var(--text-primary);
}
.vp-tree__action {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  color: var(--text-primary);
  border-radius: var(--theme-btn-radius);
  height: var(--height-md);
  padding: 0 var(--spacing-md);
  cursor: pointer;
}
.vp-tree__viewport {
  overflow: auto;
  max-height: 20rem;
  margin-top: var(--spacing-md);
}
.vp-tree__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.vp-tree__row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-height: var(--height-md);
  border-bottom: 1px solid var(--ds-border);
}
.vp-tree__row--active .vp-tree__label {
  color: var(--primary-500);
  font-weight: 600;
}
.vp-tree__toggle,
.vp-tree__label {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  font-size: var(--font-size-md);
}
.vp-tree__indent {
  display: inline-block;
  width: var(--spacing-lg);
}
</style>
