<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { normalizeTreeNodes, type TreeNode } from '@amg-webui/utils/data-display/tree-types'
import { useTreeState } from '@amg-webui/utils/data-display/useTreeState'
import type { EditTreeProps, EditTreeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<EditTreeProps & { options?: TreeNode[] }>(), {
  options: () => [],
  disabled: false
})
const emit = defineEmits<EditTreeEmits & { (e: 'add', parent: TreeNode | null): void; (e: 'remove', node: TreeNode): void }>()
const { t } = useLocale()

const localNodes = ref<TreeNode[]>(normalizeTreeNodes(props.data, props.options))
const editingId = ref<string | null>(null)
const editLabel = ref('')

const roots = computed(() => localNodes.value)
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

function startEdit(row: { id: string; node: TreeNode }) {
  editingId.value = row.id
  editLabel.value = row.node.label
}

function commitEdit(row: { id: string; node: TreeNode }) {
  row.node.label = editLabel.value.trim() || row.node.label
  editingId.value = null
  emit('change', localNodes.value)
}

function addRoot() {
  const node: TreeNode = { label: t('button.create'), value: `new-${Date.now()}` }
  localNodes.value = [...localNodes.value, node]
  emit('add', null)
  emit('change', localNodes.value)
}

function removeNode(row: { node: TreeNode }) {
  const remove = (list: TreeNode[]): TreeNode[] =>
    list
      .filter((n) => n !== row.node)
      .map((n) => ({ ...n, children: n.children ? remove(n.children) : undefined }))
  localNodes.value = remove(localNodes.value)
  emit('remove', row.node)
  emit('change', localNodes.value)
}

const titleText = computed(() => props.title ?? t('component.edit-tree.title'))
</script>

<template>
  <div role="region" aria-label="EditTree" :class="['vp-edit-tree', 'vp-edit-tree__panel', { 'vp-edit-tree--disabled': disabled }, props.class]" :style="style">
    <div class="vp-edit-tree__toolbar">
      <strong class="vp-edit-tree__title">{{ titleText }}</strong>
      <input v-model="searchQuery" class="vp-edit-tree__search" type="search" :placeholder="t('common.search')" />
      <button type="button" class="vp-edit-tree__action" :disabled="disabled" @click="addRoot">{{ t('button.create') }}</button>
      <button type="button" class="vp-edit-tree__action" :disabled="disabled" @click="expandAll">{{ t('common.expand') }}</button>
      <button type="button" class="vp-edit-tree__action" :disabled="disabled" @click="collapseAll">{{ t('common.collapse') }}</button>
    </div>
    <ul v-if="flatRows.length" class="vp-edit-tree__list">
      <li
        v-for="row in flatRows"
        :key="row.id"
        class="vp-edit-tree__row"
        :class="{ 'vp-edit-tree__row--active': activeId === row.id }"
        :style="{ paddingLeft: `calc(${row.depth} * var(--spacing-lg))` }"
      >
        <button v-if="row.hasChildren" type="button" class="vp-edit-tree__toggle" @click="toggleExpand(row.id)">
          {{ row.expanded ? '-' : '+' }}
        </button>
        <span v-else class="vp-edit-tree__indent" />
        <input
          v-if="editingId === row.id"
          v-model="editLabel"
          class="vp-edit-tree__input"
          @keyup.enter="commitEdit(row)"
          @blur="commitEdit(row)"
        />
        <button v-else type="button" class="vp-edit-tree__label" @click="selectNode(row.id, row.node)">
          {{ row.node.label }}
        </button>
        <button type="button" class="vp-edit-tree__action" :disabled="disabled" @click="startEdit(row)">{{ t('button.edit') }}</button>
        <button type="button" class="vp-edit-tree__action" :disabled="disabled" @click="removeNode(row)">{{ t('button.delete') }}</button>
      </li>
    </ul>
    <p v-else class="vp-edit-tree__muted">{{ t('common.noData') }}</p>
    <slot />
  </div>
</template>

<style scoped>
.vp-edit-tree__search,
.vp-edit-tree__input {
  flex: 1;
  min-width: 6rem;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
  background: var(--surface-0);
  color: var(--text-primary);
}
.vp-edit-tree__action {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  color: var(--text-primary);
  border-radius: var(--theme-btn-radius);
  height: var(--height-md);
  padding: 0 var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
}
.vp-edit-tree__list {
  list-style: none;
  margin: var(--spacing-md) 0 0;
  padding: 0;
  max-height: 20rem;
  overflow: auto;
}
.vp-edit-tree__row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-height: var(--height-md);
  border-bottom: 1px solid var(--ds-border);
}
.vp-edit-tree__toggle,
.vp-edit-tree__label {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
}
.vp-edit-tree__indent {
  display: inline-block;
  width: var(--spacing-lg);
}
</style>
