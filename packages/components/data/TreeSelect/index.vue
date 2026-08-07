<script setup lang="ts">
import { computed, nextTick, ref, toRef, watch } from 'vue'
import { useLocale, usePopover } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import {
  getFloatingPanelStyle,
  moveRovingIndex,
  resolveKeyboardNavAction
} from '@amg-webui/utils'
import type { TreeNode } from '@amg-webui/utils/data-display/tree-types'
import { filterTreeNodes, useTreeState } from '@amg-webui/utils/data-display/useTreeState'
import TreeCheckbox from '../Tree/TreeCheckbox.vue'
import type { TreeSelectProps, TreeSelectEmits, TreeSelectOption } from './types'
import { useFormItem } from '@amg-webui/form/FormItem/useFormItem'
import { useNativeInputAttrs } from '@amg-webui/form/FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'TreeSelect' })

const props = withDefaults(defineProps<TreeSelectProps>(), {
  options: () => [],
  filterable: false,
  clearable: false,
  multiple: false,
  showCheckbox: false,
  checkStrictly: false,
  loading: false
})

const emit = defineEmits<TreeSelectEmits>()
const { t } = useLocale()

const {
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  validateOnBlur,
  validateOnChange
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
  name: () => props.name
})

const { nativeAttrs } = useNativeInputAttrs()

const { isOpen, triggerRef, panelRef, toggle, close } = usePopover()

const filterText = ref('')
const expanded = ref<Set<unknown>>(new Set())
const focusIndex = ref(0)
const floatingPanelStyle = ref<Record<string, string>>({})

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
    void validateOnChange()
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

const navigableCount = computed(() =>
  checkboxMode.value ? checkboxRows.value.length : manualFlatNodes.value.length
)

const panelMergedStyle = computed(() => ({
  ...floatingPanelStyle.value
}))

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
const hasPanelItems = computed(() => navigableCount.value > 0)

function syncFloating() {
  const trigger = triggerRef.value
  if (!isOpen.value || !trigger) {
    floatingPanelStyle.value = {}
    return
  }
  const { style } = getFloatingPanelStyle(trigger, panelRef.value, {
    placement: 'bottom-start',
    matchTriggerWidth: true,
    offset: 4
  })
  floatingPanelStyle.value = style
}

function handleTriggerClick() {
  if (isDisabled.value) return
  toggle()
}

function handleTriggerBlur() {
  void validateOnBlur()
}

function toggleManualExpand(value: unknown, event?: Event) {
  event?.stopPropagation()
  const next = new Set(expanded.value)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  expanded.value = next
}

function selectNode(node: TreeSelectOption) {
  if (node.disabled || checkboxMode.value) return
  emit('update:modelValue', node.value)
  emit('change', node.value)
  void validateOnChange()
  close()
  floatingPanelStyle.value = {}
}

function clearValue(event: MouseEvent) {
  event.stopPropagation()
  const empty = checkboxMode.value ? [] : undefined
  emit('update:modelValue', empty)
  emit('change', empty)
  void validateOnChange()
}

function expandFocused() {
  if (checkboxMode.value) {
    const row = checkboxRows.value[focusIndex.value]
    if (!row || !(row.hasChildren || !row.node.isLeaf)) return
    toggleExpand(row.id, row.node)
    return
  }
  const entry = manualFlatNodes.value[focusIndex.value]
  if (!entry?.node.children?.length) return
  toggleManualExpand(entry.node.value)
}

function collapseFocused() {
  if (checkboxMode.value) {
    const row = checkboxRows.value[focusIndex.value]
    if (!row?.expanded) return
    toggleExpand(row.id, row.node)
    return
  }
  const entry = manualFlatNodes.value[focusIndex.value]
  if (!entry || !expanded.value.has(entry.node.value)) return
  toggleManualExpand(entry.node.value)
}

function commitFocused() {
  if (checkboxMode.value) {
    const row = checkboxRows.value[focusIndex.value]
    if (!row || row.node.disabled || isDisabled.value) return
    toggleCheck(row.node)
    return
  }
  const entry = manualFlatNodes.value[focusIndex.value]
  if (!entry) return
  if (entry.node.children?.length && !expanded.value.has(entry.node.value)) {
    toggleManualExpand(entry.node.value)
    return
  }
  selectNode(entry.node)
}

function handlePanelKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return
  const action = resolveKeyboardNavAction(event, { orientation: 'vertical' })
  if (action === 'none') {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      expandFocused()
      return
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      collapseFocused()
      return
    }
    return
  }
  event.preventDefault()
  if (action === 'close') {
    close()
    floatingPanelStyle.value = {}
    triggerRef.value?.focus?.()
    return
  }
  const count = navigableCount.value
  if (
    action === 'next' ||
    action === 'prev' ||
    action === 'first' ||
    action === 'last'
  ) {
    focusIndex.value = moveRovingIndex(focusIndex.value, action, count, true)
    return
  }
  if (action === 'select') commitFocused()
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return
  const action = resolveKeyboardNavAction(event, { orientation: 'vertical' })
  if (!isOpen.value) {
    if (action === 'next' || action === 'select' || event.key === 'ArrowDown') {
      event.preventDefault()
      if (!isOpen.value) toggle()
      focusIndex.value = 0
    }
    return
  }
  handlePanelKeydown(event)
}

watch(isOpen, (open) => {
  if (open) {
    focusIndex.value = 0
    nextTick(syncFloating)
  } else {
    floatingPanelStyle.value = {}
  }
})

watch([navigableCount, filterText, expanded, checkboxRows], () => {
  if (isOpen.value) nextTick(syncFloating)
  if (focusIndex.value >= navigableCount.value) {
    focusIndex.value = Math.max(0, navigableCount.value - 1)
  }
})
</script>

<template>
  <div :class="['vp-treeselect', props.class]" :style="style">
    <button
      ref="triggerRef"
      v-bind="nativeAttrs"
      :id="inputId"
      type="button"
      class="vp-treeselect__trigger"
      role="combobox"
      :disabled="isDisabled"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      @click="handleTriggerClick"
      @blur="handleTriggerBlur"
      @keydown="handleTriggerKeydown"
    >
      <span
        :class="['vp-treeselect__label', { 'vp-treeselect__label--placeholder': isPlaceholder }]"
      >
        <slot>
          {{ isPlaceholder ? placeholderText : displayLabel }}
        </slot>
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

    <div
      v-if="isOpen"
      ref="panelRef"
      class="vp-treeselect__panel"
      role="listbox"
      :style="panelMergedStyle"
      @keydown="handlePanelKeydown"
    >
      <div v-if="filterable" class="vp-treeselect__filter">
        <input
          v-model="filterText"
          type="search"
          class="vp-treeselect__filter-input"
          :placeholder="t('common.search')"
        />
      </div>

      <div v-if="loading" class="vp-treeselect__loading" role="status">
        <slot name="loading">
          {{ t(LocaleKeys.component.select.loading) }}
        </slot>
      </div>

      <template v-else-if="checkboxMode">
        <div
          v-for="(row, rowIndex) in checkboxRows"
          :key="row.id"
          :class="[
            'vp-treeselect__node',
            { 'vp-treeselect__node--active': rowIndex === focusIndex }
          ]"
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
            :disabled="isDisabled || row.node.disabled"
            @change="toggleCheck(row.node)"
          />
          <span class="vp-treeselect__node-label">
            <slot name="option" :node="row.node" :depth="row.depth">
              {{ row.node.label }}
            </slot>
          </span>
        </div>
      </template>

      <template v-else>
        <div
          v-for="({ node, depth }, rowIndex) in manualFlatNodes"
          :key="String(node.value)"
          :class="[
            'vp-treeselect__node',
            {
              'vp-treeselect__node--selected': node.value === modelValue,
              'vp-treeselect__node--disabled': node.disabled,
              'vp-treeselect__node--active': rowIndex === focusIndex
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
          <span>
            <slot name="option" :node="node" :depth="depth">
              {{ node.label }}
            </slot>
          </span>
        </div>
      </template>

      <p v-if="!loading && !hasPanelItems" class="vp-treeselect__empty" role="status">
        <slot name="empty">
          {{ t('common.noData') }}
        </slot>
      </p>
    </div>
    <slot />
  </div>
</template>
