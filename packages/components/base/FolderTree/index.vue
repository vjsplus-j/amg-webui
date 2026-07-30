<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { normalizeTreeNodes, type TreeNode } from '@amg-webui/utils/data-display/tree-types'
import { useTreeState } from '@amg-webui/utils/data-display/useTreeState'
import type { FolderTreeProps, FolderTreeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<FolderTreeProps & { options?: TreeNode[] }>(), {
  options: () => [],
  disabled: false
})
const emit = defineEmits<FolderTreeEmits>()
const { t } = useLocale()

const roots = computed(() => {
  const nodes = normalizeTreeNodes(props.data, props.options)
  const mark = (list: TreeNode[]): TreeNode[] =>
    list.map((n) => ({
      ...n,
      isFolder: n.isFolder ?? Boolean(n.children?.length),
      isLeaf: n.isLeaf ?? !n.children?.length,
      children: n.children ? mark(n.children) : undefined
    }))
  return mark(nodes)
})

const modelRef = toRef(props, 'modelValue')
const {
  searchQuery,
  flatRows,
  activeId,
  toggleExpand,
  selectNode,
  expandAll,
  collapseAll
} = useTreeState(roots, modelRef, emit as never, { checkable: false })

const titleText = computed(() => props.title ?? t('component.folder-tree.title'))
</script>

<template>
  <div :class="['vp-folder-tree', 'vp-folder-tree__panel', { 'vp-folder-tree--disabled': disabled }, props.class]" :style="style">
    <div class="vp-folder-tree__toolbar">
      <strong class="vp-folder-tree__title">{{ titleText }}</strong>
      <input v-model="searchQuery" class="vp-folder-tree__search" type="search" :placeholder="t('common.search')" />
      <button type="button" class="vp-folder-tree__action" @click="expandAll">{{ t('common.expand') }}</button>
      <button type="button" class="vp-folder-tree__action" @click="collapseAll">{{ t('common.collapse') }}</button>
    </div>
    <ul v-if="flatRows.length" class="vp-folder-tree__list">
      <li
        v-for="row in flatRows"
        :key="row.id"
        class="vp-folder-tree__row"
        :class="{ 'vp-folder-tree__row--active': activeId === row.id }"
        :style="{ paddingLeft: `calc(${row.depth} * var(--spacing-lg))` }"
      >
        <button
          v-if="row.node.isFolder"
          type="button"
          class="vp-folder-tree__toggle"
          @click="toggleExpand(row.id)"
        >
          {{ row.expanded ? '-' : '+' }}
        </button>
        <span v-else class="vp-folder-tree__indent" />
        <span class="vp-folder-tree__icon" :aria-label="row.node.isFolder ? t('common.folder') : t('common.file')">
          {{ row.node.isFolder ? '📁' : '📄' }}
        </span>
        <button type="button" class="vp-folder-tree__label" @click="selectNode(row.id, row.node)">
          {{ row.node.label }}
        </button>
      </li>
    </ul>
    <p v-else class="vp-folder-tree__muted">{{ t('common.noData') }}</p>
    <slot />
  </div>
</template>

<style scoped>
.vp-folder-tree__search {
  flex: 1;
  min-width: 8rem;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
  background: var(--surface-0);
  color: var(--text-primary);
}
.vp-folder-tree__action {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  border-radius: var(--theme-btn-radius);
  height: var(--height-md);
  padding: 0 var(--spacing-md);
  cursor: pointer;
}
.vp-folder-tree__list {
  list-style: none;
  margin: var(--spacing-md) 0 0;
  padding: 0;
  max-height: 20rem;
  overflow: auto;
}
.vp-folder-tree__row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-height: var(--height-md);
  border-bottom: 1px solid var(--ds-border);
}
.vp-folder-tree__toggle,
.vp-folder-tree__label {
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-primary);
}
.vp-folder-tree__indent {
  width: var(--spacing-lg);
}
</style>
