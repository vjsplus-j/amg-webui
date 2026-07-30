<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { useLocale, usePopover } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { TreeNode } from '@amg-webui/utils/data-display/tree-types'
import { filterTreeNodes, useTreeState } from '@amg-webui/utils/data-display/useTreeState'
import TreeCheckbox from '../Tree/TreeCheckbox.vue'
import type { TreeSelectProps, TreeSelectEmits, TreeSelectOption } from './types'
import './style.scss'

const props = withDefaults(defineProps<TreeSelectProps>(), {
  options: () => [],
  filterable: false,
  clearable: false,
  multiple: false,
  showCheckbox: false,
  checkStrictly: false
})

const emit = defineEmits<TreeSelectEmits>()
const { t } = useLocale()
const { isOpen, triggerRef, panelRef, toggle, close } = usePopover()

const filterText = ref('')
const expanded = ref<Set<unknown>>(new Set())

function toTreeNodes(opts: TreeSelectOption[]): TreeNode[] {
  return opts.map((o) => ({
    label: o.label,
    value: o.value as string | number,
    disabled: o.disabled,
    children: o.children?.length ? toTreeNodes(o.children) : undefined,
    isLeaf: !o.children?.length
  }))
}

function toSelectOptions(nodes: TreeNode[]): TreeSelectOption[] {
  return nodes.map((n) => ({
    label: n.label,
    value: n.value ?? n.label,
    disabled: n.disabled,
    children: n.children?.length ? toSelectOptions(n.children) : undefined
  }))
}

const treeRoots = computed(() => toTreeNodes(props.options ?? []))
const filteredRoots = computed(() => filterTreeNodes(treeRoots.value, filterText.value))
const checkboxMode = computed(() => props.showCheckbox || props.multiple)

const modelRef = toRef(props, 'modelValue')
const arrayModel = computed({
  get: () => (Array.isArray(modelRef.value) ? modelRef.value : []) as (string | number)[],
  set: (v: (string | number)[]) => {
    emit('update:modelValue', v)
    emit('change', v)
  }
})

const checkboxModelRef = computed({
  get: () => arrayModel.value,
  set: (v) => {
    arrayModel.value = v as (string | number)[]
  }
})

const {
  flatRows: checkboxRows,
  toggleExpand,
  toggleCheck,
  getCheckState
} = useTreeState(filteredRoots, checkboxModelRef, emit as never, {
  checkable: true,
  checkStrictly: props.checkStrictly
})

const manualFlatNodes = computed(() => {
  const result: { node: TreeSelectOption; depth: number }[] = []
  const walk = (nodes: TreeSelectOption[], depth: number) => {
    for (const node of nodes) {
      result.push({ node, depth })
      if (node.children?.length && expanded.value.has(node.value)) {
        walk(node.children, depth + 1)
      }
    }
  }
  walk(toSelectOptions(filteredRoots.value), 0)
  return result
})

const placeholderText = computed(
  () => props.placeholder ?? t(LocaleKeys.component.treeSelect.placeholder)
)

function findLabel(nodes: TreeSelectOption[], value: unknown): string | null {
  for (const node of nodes) {
    if (node.value === value) return node.label
    if (node.children?.length) {
      const found = findLabel(node.children, value)
      if (found) return found
    }
  }
  return null
}

const displayLabel = computed(() => {
  if (checkboxMode.value) {
    if (!arrayModel.value.length) return ''
    return arrayModel.value
      .map((v) => findLabel(props.options ?? [], v) ?? String(v))
      .join(', ')
  }
  if (props.modelValue == null || props.modelValue === '') return ''
  return findLabel(props.options ?? [], props.modelValue) ?? String(props.modelValue)
})

const isPlaceholder = computed(() => !displayLabel.value)
const hasPanelItems = computed(() =>
  checkboxMode.value ? checkboxRows.value.length > 0 : manualFlatNodes.value.length > 0
)

function handleTriggerClick() {
  if (props.disabled) return
  toggle()
}

function toggleManualExpand(value: unknown, event: Event) {
  event.stopPropagation()
  const next = new Set(expanded.value)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  expanded.value = next
}

function selectNode(node: TreeSelectOption) {
  if (node.disabled || checkboxMode.value) return
  emit('update:modelValue', node.value)
  emit('change', node.value)
  close()
}

function clearValue(event: MouseEvent) {
  event.stopPropagation()
  const empty = checkboxMode.value ? [] : undefined
  emit('update:modelValue', empty)
  emit('change', empty)
}
</script>

<template>
  <div :class="['vp-treeselect', props.class]" :style="style">
    <button
      ref="triggerRef"
      type="button"
      class="vp-treeselect__trigger"
      :disabled="disabled"
      :aria-expanded="isOpen"
      @click="handleTriggerClick"
    >
      <span
        :class="['vp-treeselect__label', { 'vp-treeselect__label--placeholder': isPlaceholder }]"
      >
        {{ isPlaceholder ? placeholderText : displayLabel }}
      </span>
      <button
        v-if="clearable && !isPlaceholder"
        type="button"
        class="vp-treeselect__clear"
        :aria-label="t('common.close')"
        @click="clearValue"
      >
        ×
      </button>
      <span class="vp-treeselect__caret" aria-hidden="true">▾</span>
    </button>

    <div v-if="isOpen" ref="panelRef" class="vp-treeselect__panel" role="listbox">
      <div v-if="filterable" class="vp-treeselect__filter">
        <input
          v-model="filterText"
          type="search"
          class="vp-treeselect__filter-input"
          :placeholder="t('common.search')"
        />
      </div>

      <template v-if="checkboxMode">
        <div
          v-for="row in checkboxRows"
          :key="row.id"
          class="vp-treeselect__node"
          :style="{ paddingLeft: `calc(var(--spacing-md) + ${row.depth} * var(--spacing-lg))` }"
        >
          <button
            v-if="row.hasChildren || !row.node.isLeaf"
            type="button"
            class="vp-treeselect__expand"
            :aria-label="row.expanded ? t('common.collapse') : t('common.expand')"
            @click="toggleExpand(row.id, row.node)"
          >
            {{ row.expanded ? '−' : '+' }}
          </button>
          <span v-else class="vp-treeselect__expand" aria-hidden="true" />
          <TreeCheckbox
            :checked="getCheckState(row.node) === 'checked'"
            :indeterminate="getCheckState(row.node) === 'indeterminate'"
            :disabled="disabled || row.node.disabled"
            @change="toggleCheck(row.node)"
          />
          <span class="vp-treeselect__node-label">{{ row.node.label }}</span>
        </div>
      </template>

      <template v-else>
        <div
          v-for="{ node, depth } in manualFlatNodes"
          :key="String(node.value)"
          :class="[
            'vp-treeselect__node',
            {
              'vp-treeselect__node--selected': node.value === modelValue,
              'vp-treeselect__node--disabled': node.disabled
            }
          ]"
          :style="{ paddingLeft: `calc(var(--spacing-md) + ${depth} * var(--spacing-lg))` }"
          role="option"
          :aria-selected="node.value === modelValue"
          @click="selectNode(node)"
        >
          <button
            v-if="node.children?.length"
            type="button"
            class="vp-treeselect__expand"
            :aria-label="expanded.has(node.value) ? t('common.collapse') : t('common.expand')"
            @click="toggleManualExpand(node.value, $event)"
          >
            {{ expanded.has(node.value) ? '−' : '+' }}
          </button>
          <span v-else class="vp-treeselect__expand" aria-hidden="true" />
          <span
            :class="[
              'vp-treeselect__radio',
              { 'vp-treeselect__radio--checked': node.value === modelValue }
            ]"
            aria-hidden="true"
          />
          <span>{{ node.label }}</span>
        </div>
      </template>

      <p v-if="!hasPanelItems" class="vp-treeselect__empty">
        {{ t('common.noData') }}
      </p>
    </div>
  </div>
</template>
