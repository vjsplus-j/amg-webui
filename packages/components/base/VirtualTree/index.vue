<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { normalizeTreeNodes, type TreeNode } from '@amg-webui/utils/data-display/tree-types'
import { useTreeState } from '@amg-webui/utils/data-display/useTreeState'
import { useVirtualList } from '@amg-webui/utils/data-display/useVirtualList'
import type { VirtualTreeProps, VirtualTreeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VirtualTreeProps & { options?: TreeNode[]; checkable?: boolean }>(), {
  options: () => [],
  checkable: true,
  disabled: false,
  loading: false
})
const emit = defineEmits<VirtualTreeEmits>()
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

const flatRef = computed(() => flatRows.value)
const { visibleItems, totalHeight, offsetY, itemHeight, onScroll } = useVirtualList(flatRef, {
  containerHeight: 320
})

const titleText = computed(() => props.title ?? t('component.virtual-tree.title'))
</script>

<template>
  <div
    :class="['vp-virtual-tree', 'vp-virtual-tree__panel', { 'vp-virtual-tree--disabled': disabled }, props.class]"
    :style="style"
  >
    <div class="vp-virtual-tree__toolbar">
      <strong class="vp-virtual-tree__title">{{ titleText }}</strong>
      <input
        v-model="searchQuery"
        class="vp-virtual-tree__search"
        type="search"
        :placeholder="t('common.search')"
        :disabled="disabled"
      />
      <button type="button" class="vp-virtual-tree__action" :disabled="disabled" @click="expandAll">
        {{ t('common.expand') }}
      </button>
      <button type="button" class="vp-virtual-tree__action" :disabled="disabled" @click="collapseAll">
        {{ t('common.collapse') }}
      </button>
    </div>
    <div class="vp-virtual-tree__viewport" @scroll="onScroll">
      <div class="vp-virtual-tree__spacer" :style="{ height: `${totalHeight}px` }">
        <ul class="vp-virtual-tree__list" :style="{ transform: `translateY(${offsetY}px)` }">
          <li
            v-for="{ item: row } in visibleItems"
            :key="row.id"
            class="vp-virtual-tree__row"
            :class="{ 'vp-virtual-tree__row--active': activeId === row.id }"
            :style="{ height: `${itemHeight}px`, paddingLeft: `calc(${row.depth} * var(--spacing-lg))` }"
          >
            <button
              v-if="row.hasChildren"
              type="button"
              class="vp-virtual-tree__toggle"
              :aria-label="row.expanded ? t('common.collapse') : t('common.expand')"
              :disabled="disabled"
              @click="toggleExpand(row.id)"
            >
              {{ row.expanded ? '-' : '+' }}
            </button>
            <span v-else class="vp-virtual-tree__indent" />
            <input
              v-if="checkable"
              type="checkbox"
              :disabled="disabled || row.node.disabled"
              :checked="checkedSet.has(row.node.value ?? row.node.label)"
              @change="toggleCheck(row.node)"
            />
            <button
              type="button"
              class="vp-virtual-tree__label"
              :disabled="disabled"
              @click="selectNode(row.id, row.node)"
            >
              {{ row.node.label }}
            </button>
          </li>
        </ul>
      </div>
      <p v-if="!flatRows.length" class="vp-virtual-tree__muted">{{ t('common.noData') }}</p>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-virtual-tree__search {
  flex: 1;
  min-width: 8rem;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
  background: var(--surface-0);
  color: var(--text-primary);
}
.vp-virtual-tree__action {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  color: var(--text-primary);
  border-radius: var(--theme-btn-radius);
  height: var(--height-md);
  padding: 0 var(--spacing-md);
  cursor: pointer;
}
.vp-virtual-tree__viewport {
  position: relative;
  overflow: auto;
  max-height: 20rem;
  margin-top: var(--spacing-md);
}
.vp-virtual-tree__list {
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
.vp-virtual-tree__row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  border-bottom: 1px solid var(--ds-border);
}
.vp-virtual-tree__row--active .vp-virtual-tree__label {
  color: var(--primary-500);
  font-weight: 600;
}
.vp-virtual-tree__toggle,
.vp-virtual-tree__label {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
}
.vp-virtual-tree__indent {
  display: inline-block;
  width: var(--spacing-lg);
}
</style>
