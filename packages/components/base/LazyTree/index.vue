<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { normalizeTreeNodes, type TreeNode } from '@amg-webui/utils/data-display/tree-types'
import { useTreeState } from '@amg-webui/utils/data-display/useTreeState'
import type { LazyTreeProps, LazyTreeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<LazyTreeProps & { options?: TreeNode[]; checkable?: boolean }>(), {
  options: () => [],
  checkable: true,
  disabled: false,
  loading: false
})
const emit = defineEmits<LazyTreeEmits & { (e: 'load', node: TreeNode): void }>()
const { t } = useLocale()

const localNodes = ref<TreeNode[]>(normalizeTreeNodes(props.data, props.options))
const loadingIds = ref<Set<string>>(new Set())
const loadedIds = ref<Set<string>>(new Set())

const roots = computed(() => localNodes.value)
const modelRef = toRef(props, 'modelValue')
const {
  searchQuery,
  flatRows,
  checkedSet,
  activeId,
  expandedSet,
  toggleExpand: baseToggle,
  toggleCheck,
  selectNode,
  expandAll,
  collapseAll
} = useTreeState(roots, modelRef, emit as (e: 'update:modelValue' | 'change', v: unknown) => void, { checkable: props.checkable })

function toggleExpand(id: string, node: TreeNode) {
  const hasKids = Boolean(node.children?.length)
  const isLeaf = node.isLeaf
  if (!hasKids && !isLeaf && !loadedIds.value.has(id)) {
    loadingIds.value = new Set([...loadingIds.value, id])
    emit('load', node)
    loadedIds.value = new Set([...loadedIds.value, id])
    loadingIds.value = new Set([...loadingIds.value].filter((x) => x !== id))
    expandedSet.value = new Set([...expandedSet.value, id])
    return
  }
  baseToggle(id)
}

const titleText = computed(() => props.title ?? t('component.lazy-tree.title'))
</script>

<template>
  <div
    :class="['vp-lazy-tree', 'vp-lazy-tree__panel', { 'vp-lazy-tree--disabled': disabled }, props.class]"
    :style="style"
  >
    <div class="vp-lazy-tree__toolbar">
      <strong class="vp-lazy-tree__title">{{ titleText }}</strong>
      <input
        v-model="searchQuery"
        class="vp-lazy-tree__search"
        type="search"
        :placeholder="t('common.search')"
        :disabled="disabled"
      />
      <button type="button" class="vp-lazy-tree__action" :disabled="disabled" @click="expandAll">
        {{ t('common.expand') }}
      </button>
      <button type="button" class="vp-lazy-tree__action" :disabled="disabled" @click="collapseAll">
        {{ t('common.collapse') }}
      </button>
    </div>
    <div class="vp-lazy-tree__viewport">
      <ul v-if="flatRows.length" class="vp-lazy-tree__list">
        <li
          v-for="row in flatRows"
          :key="row.id"
          class="vp-lazy-tree__row"
          :class="{ 'vp-lazy-tree__row--active': activeId === row.id }"
          :style="{ paddingLeft: `calc(${row.depth} * var(--spacing-lg))` }"
        >
          <button
            v-if="row.hasChildren || !row.node.isLeaf"
            type="button"
            class="vp-lazy-tree__toggle"
            :disabled="disabled || loadingIds.has(row.id)"
            @click="toggleExpand(row.id, row.node)"
          >
            {{ loadingIds.has(row.id) ? '...' : row.expanded ? '-' : '+' }}
          </button>
          <span v-else class="vp-lazy-tree__indent" />
          <input
            v-if="checkable"
            type="checkbox"
            :disabled="disabled || row.node.disabled"
            :checked="checkedSet.has(row.node.value ?? row.node.label)"
            @change="toggleCheck(row.node)"
          />
          <button type="button" class="vp-lazy-tree__label" :disabled="disabled" @click="selectNode(row.id, row.node)">
            {{ row.node.label }}
          </button>
        </li>
      </ul>
      <p v-else class="vp-lazy-tree__muted">{{ t('common.noData') }}</p>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-lazy-tree__search {
  flex: 1;
  min-width: 8rem;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
  background: var(--surface-0);
  color: var(--text-primary);
}
.vp-lazy-tree__action {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  color: var(--text-primary);
  border-radius: var(--theme-btn-radius);
  height: var(--height-md);
  padding: 0 var(--spacing-md);
  cursor: pointer;
}
.vp-lazy-tree__viewport {
  overflow: auto;
  max-height: 20rem;
  margin-top: var(--spacing-md);
}
.vp-lazy-tree__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.vp-lazy-tree__row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-height: var(--height-md);
  border-bottom: 1px solid var(--ds-border);
}
.vp-lazy-tree__toggle,
.vp-lazy-tree__label {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
}
.vp-lazy-tree__indent {
  display: inline-block;
  width: var(--spacing-lg);
}
</style>
