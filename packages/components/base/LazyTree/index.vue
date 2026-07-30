<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import {
  normalizeTreeNodes,
  nodeValue,
  patchTreeNodeChildren,
  type TreeNode
} from '@amg-webui/utils/data-display/tree-types'
import { useTreeState } from '@amg-webui/utils/data-display/useTreeState'
import Spin from '../Spin/index.vue'
import TreeCheckbox from '../Tree/TreeCheckbox.vue'
import type { LazyTreeProps, LazyTreeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<LazyTreeProps>(), {
  options: () => [],
  checkable: true,
  checkStrictly: false,
  defaultExpandAll: false,
  disabled: false,
  loading: false
})

const emit = defineEmits<LazyTreeEmits>()
const { t } = useLocale()

const localNodes = ref<TreeNode[]>(normalizeTreeNodes(props.data, props.options))
const loadingIds = ref<Set<string>>(new Set())
const loadedIds = ref<Set<string>>(new Set())

watch(
  () => [props.data, props.options] as const,
  () => {
    localNodes.value = normalizeTreeNodes(props.data, props.options)
    loadedIds.value = new Set()
  }
)

const roots = computed(() => localNodes.value)
const modelRef = toRef(props, 'modelValue')

const {
  searchQuery,
  flatRows,
  activeId,
  expandedSet,
  toggleExpand: baseToggle,
  toggleCheck,
  getCheckState,
  selectNode,
  expandAll,
  collapseAll
} = useTreeState(roots, modelRef, emit, {
  checkable: props.checkable,
  defaultExpandAll: props.defaultExpandAll,
  checkStrictly: props.checkStrictly
})

async function resolveLoad(node: TreeNode, id: string, children: TreeNode[]) {
  localNodes.value = patchTreeNodeChildren(localNodes.value, nodeValue(node), children)
  loadingIds.value = new Set([...loadingIds.value].filter((x) => x !== id))
  loadedIds.value = new Set([...loadedIds.value, id])
  expandedSet.value = new Set([...expandedSet.value, id])
  emit('node-expand', node)
}

async function triggerLoad(node: TreeNode, id: string) {
  loadingIds.value = new Set([...loadingIds.value, id])

  if (props.load) {
    try {
      const children = await props.load(node)
      await resolveLoad(node, id, children)
    } catch {
      loadingIds.value = new Set([...loadingIds.value].filter((x) => x !== id))
    }
    return
  }

  emit('load', {
    node,
    resolve: (children) => {
      void resolveLoad(node, id, children)
    }
  })
}

function toggleExpand(id: string, node: TreeNode) {
  const hasKids = Boolean(node.children?.length)
  const isLeaf = node.isLeaf
  const needsLoad = !hasKids && !isLeaf && !loadedIds.value.has(id)

  if (needsLoad) {
    void triggerLoad(node, id)
    return
  }

  baseToggle(id, node)
}

function rowNeedsToggle(row: { hasChildren: boolean; node: TreeNode }) {
  return row.hasChildren || !row.node.isLeaf
}

const titleText = computed(() => props.title ?? t('component.lazy-tree.title'))
</script>

<template>
  <div
    :class="[
      'vp-lazy-tree',
      'vp-lazy-tree__panel',
      {
        'vp-lazy-tree--disabled': disabled,
        'vp-lazy-tree--loading': loading
      },
      props.class
    ]"
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

    <div class="vp-lazy-tree__body">
      <div
        class="vp-lazy-tree__viewport"
        role="tree"
        :aria-label="titleText"
        :aria-busy="loading || undefined"
      >
        <ul v-if="flatRows.length" class="vp-lazy-tree__list">
          <li
            v-for="row in flatRows"
            :key="row.id"
            role="treeitem"
            class="vp-lazy-tree__row"
            :class="{ 'vp-lazy-tree__row--active': activeId === row.id }"
            :style="{ paddingLeft: `calc(${row.depth} * var(--spacing-lg))` }"
            :aria-expanded="rowNeedsToggle(row) ? row.expanded : undefined"
          >
            <button
              v-if="rowNeedsToggle(row)"
              type="button"
              class="vp-lazy-tree__toggle"
              :aria-label="row.expanded ? t('common.collapse') : t('common.expand')"
              :disabled="disabled || loadingIds.has(row.id)"
              @click="toggleExpand(row.id, row.node)"
            >
              <Spin
                v-if="loadingIds.has(row.id)"
                class="vp-lazy-tree__node-spin"
                :spinning="true"
                size="sm"
              />
              <template v-else>{{ row.expanded ? '−' : '+' }}</template>
            </button>
            <span v-else class="vp-lazy-tree__indent" aria-hidden="true" />
            <TreeCheckbox
              v-if="checkable"
              :checked="getCheckState(row.node) === 'checked'"
              :indeterminate="getCheckState(row.node) === 'indeterminate'"
              :disabled="disabled || row.node.disabled"
              @change="toggleCheck(row.node)"
            />
            <button
              type="button"
              class="vp-lazy-tree__label"
              :disabled="disabled || row.node.disabled"
              @click="selectNode(row.id, row.node)"
            >
              {{ row.node.label }}
            </button>
          </li>
        </ul>
        <slot v-else name="empty">
          <p class="vp-lazy-tree__muted">{{ t('common.noData') }}</p>
        </slot>
      </div>

      <Spin v-if="loading" class="vp-lazy-tree__spin" :spinning="loading" size="sm" />
    </div>

    <slot />
  </div>
</template>

<style scoped lang="scss">
.vp-lazy-tree__body {
  position: relative;
  margin-top: var(--spacing-md);
}

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

.vp-lazy-tree__row--active .vp-lazy-tree__label {
  color: var(--primary-500);
  font-weight: 600;
}

.vp-lazy-tree__toggle,
.vp-lazy-tree__label {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  font-size: var(--font-size-md);
}

.vp-lazy-tree__indent {
  display: inline-block;
  width: var(--spacing-lg);
}

.vp-lazy-tree__node-spin {
  display: inline-flex;
  width: var(--spacing-lg);
  height: var(--spacing-lg);
}

.vp-lazy-tree__spin {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--surface-1) 72%, transparent);
  border-radius: var(--theme-card-radius);
}
</style>
