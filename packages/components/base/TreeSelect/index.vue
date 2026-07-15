<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePopover } from '@amg-webui/hooks'
import type { TreeSelectProps, TreeSelectEmits, TreeSelectOption } from './types'
import './style.scss'

const props = withDefaults(defineProps<TreeSelectProps>(), {
  options: () => []
})

const emit = defineEmits<TreeSelectEmits>()

const { isOpen, triggerRef, panelRef, toggle, close } = usePopover()
const expanded = ref<Set<unknown>>(new Set())

const findLabel = (
  nodes: TreeSelectOption[],
  value: unknown
): string | null => {
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
  if (!props.modelValue) return ''
  return findLabel(props.options ?? [], props.modelValue) ?? String(props.modelValue)
})

const isPlaceholder = computed(() => !props.modelValue && !!props.placeholder)

const flatNodes = computed(() => {
  const result: { node: TreeSelectOption; depth: number; visible: boolean }[] = []

  const walk = (nodes: TreeSelectOption[], depth: number) => {
    for (const node of nodes) {
      const hasChildren = !!node.children?.length
      const isExpanded = expanded.value.has(node.value)
      result.push({ node, depth, visible: true })
      if (hasChildren && isExpanded) {
        walk(node.children!, depth + 1)
      }
    }
  }

  walk(props.options ?? [], 0)
  return result
})

const handleTriggerClick = () => {
  if (props.disabled) return
  toggle()
}

const toggleExpand = (value: unknown, event: Event) => {
  event.stopPropagation()
  const next = new Set(expanded.value)
  if (next.has(value)) {
    next.delete(value)
  } else {
    next.add(value)
  }
  expanded.value = next
}

const selectNode = (node: TreeSelectOption) => {
  if (node.disabled) return
  emit('update:modelValue', node.value)
  emit('change', node.value)
  close()
}
</script>

<template>
  <div :class="['vp-treeselect', props.class]" :style="style">
    <button
      ref="triggerRef"
      type="button"
      class="vp-treeselect__trigger"
      :disabled="disabled"
      @click="handleTriggerClick"
    >
      <span
        :class="['vp-treeselect__label', { 'vp-treeselect__label--placeholder': isPlaceholder }]"
      >
        {{ isPlaceholder ? placeholder : displayLabel }}
      </span>
      <span aria-hidden="true">v</span>
    </button>

    <div v-if="isOpen" ref="panelRef" class="vp-treeselect__panel">
      <div
        v-for="{ node, depth } in flatNodes"
        :key="String(node.value)"
        :class="[
          'vp-treeselect__node',
          {
            'vp-treeselect__node--selected': node.value === modelValue,
            'vp-treeselect__node--disabled': node.disabled
          }
        ]"
        :style="{ paddingLeft: `calc(var(--spacing-md) + ${depth} * var(--spacing-lg))` }"
        @click="selectNode(node)"
      >
        <span
          v-if="node.children?.length"
          class="vp-treeselect__expand"
          @click="toggleExpand(node.value, $event)"
        >
          {{ expanded.has(node.value) ? '-' : '+' }}
        </span>
        <span v-else class="vp-treeselect__expand" />
        <span
          :class="[
            'vp-treeselect__radio',
            { 'vp-treeselect__radio--checked': node.value === modelValue }
          ]"
        />
        <span>{{ node.label }}</span>
      </div>
    </div>
  </div>
</template>
