import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const base = resolve(root, 'packages/components/base')
const waves = JSON.parse(readFileSync(resolve(root, 'scripts/.component-waves.json'), 'utf8'))
const names = waves.waves.w2_data

const treeVue = (name, kebab, extra = '') => `\
<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { normalizeTreeNodes, type TreeNode } from '../_shared/tree-types'
import { useTreeState } from '../_shared/useTreeState'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'
${extra.includes('useVirtualList') ? "import { useVirtualList } from '../_shared/useVirtualList'" : ''}
${extra.includes('onUnmounted') ? "import { onUnmounted } from 'vue'" : ''}

const props = withDefaults(defineProps<${name}Props & { options?: TreeNode[]; checkable?: boolean }>(), {
  options: () => [],
  checkable: true,
  disabled: false,
  loading: false
})
const emit = defineEmits<${name}Emits>()
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
} = useTreeState(roots, modelRef, emit, { checkable: props.checkable })
${extra}
const titleText = computed(() => props.title ?? t('component.${kebab}.title'))
</script>

<template>
  <div :class="['vp-${kebab}', 'vp-${kebab}__panel', { 'vp-${kebab}--disabled': disabled, 'vp-${kebab}--loading': loading }, props.class]" :style="style">
    <div class="vp-${kebab}__toolbar">
      <strong class="vp-${kebab}__title">{{ titleText }}</strong>
      <input v-model="searchQuery" class="vp-${kebab}__search" type="search" :placeholder="t('common.search')" :disabled="disabled" />
      <button type="button" class="vp-${kebab}__action" :disabled="disabled" @click="expandAll">{{ t('common.expand') }}</button>
      <button type="button" class="vp-${kebab}__action" :disabled="disabled" @click="collapseAll">{{ t('common.collapse') }}</button>
    </div>
    <div class="vp-${kebab}__viewport" @scroll="onScroll">
      <div class="vp-${kebab}__spacer" :style="{ height: totalHeight + 'px' }">
        <ul class="vp-${kebab}__list" :style="{ transform: 'translateY(' + offsetY + 'px)' }">
          <li
            v-for="{ item: row, index } in visibleItems"
            :key="row.id"
            class="vp-${kebab}__row"
            :class="{ 'vp-${kebab}__row--active': activeId === row.id }"
            :style="{ paddingLeft: 'calc(' + row.depth + ' * var(--spacing-lg))' }"
          >
            <button
              v-if="row.hasChildren"
              type="button"
              class="vp-${kebab}__toggle"
              :aria-label="row.expanded ? t('common.collapse') : t('common.expand')"
              :disabled="disabled"
              @click="toggleExpand(row.id)"
            >{{ row.expanded ? '−' : '+' }}</button>
            <span v-else class="vp-${kebab}__spacer-icon" />
            <input
              v-if="checkable"
              type="checkbox"
              :disabled="disabled || row.node.disabled"
              :checked="checkedSet.has(row.node.value ?? row.node.label)"
              @change="toggleCheck(row.node)"
            />
            <button type="button" class="vp-${kebab}__label" :disabled="disabled" @click="selectNode(row.id, row.node)">
              {{ row.node.label }}
            </button>
          </li>
        </ul>
      </div>
      <p v-if="!flatRows.length" class="vp-${kebab}__muted">{{ t('common.noData') }}</p>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-${kebab}__search {
  flex: 1;
  min-width: 8rem;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
  background: var(--surface-0);
  color: var(--text-primary);
}
.vp-${kebab}__action {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  color: var(--text-primary);
  border-radius: var(--theme-btn-radius);
  height: var(--height-md);
  padding: 0 var(--spacing-md);
  cursor: pointer;
}
.vp-${kebab}__viewport {
  position: relative;
  overflow: auto;
  max-height: 20rem;
  margin-top: var(--spacing-md);
}
.vp-${kebab}__list {
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
.vp-${kebab}__row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  height: var(--height-md);
  border-bottom: 1px solid var(--ds-border);
}
.vp-${kebab}__row--active .vp-${kebab}__label {
  color: var(--primary-500);
  font-weight: 600;
}
.vp-${kebab}__toggle,
.vp-${kebab}__label {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  font-size: var(--font-size-md);
}
.vp-${kebab}__spacer-icon {
  display: inline-block;
  width: var(--spacing-lg);
}
</style>
`

// Simpler implementations per component group - write individual files
const implementations = {}

function write(name, content) {
  const dir = join(base, name)
  writeFileSync(join(dir, 'index.vue'), content)
  console.log('upgraded', name)
}

// Run individual writers below via imports from generated content file
console.log('w2_data count:', names.length)
