<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Checkbox from '../Checkbox/index.vue'
import Button from '../Button/index.vue'
import type { PermissionPanelProps, PermissionPanelEmits, PermissionNode } from './types'
import './style.scss'

const props = withDefaults(defineProps<PermissionPanelProps>(), {
  modelValue: () => [],
  tree: () => [],
  checkStrictly: false
})

const emit = defineEmits<PermissionPanelEmits>()
const { t } = useLocale()

const expanded = ref<Set<string>>(new Set())

const selected = computed(() => new Set(props.modelValue ?? []))

const emitSelection = (next: string[]) => {
  emit('update:modelValue', next)
  emit('change', next)
}

const collectDescendants = (node: PermissionNode): string[] => {
  const ids = [node.id]
  node.children?.forEach((child) => ids.push(...collectDescendants(child)))
  return ids
}

const toggle = (node: PermissionNode, checked: boolean) => {
  const set = new Set(props.modelValue ?? [])
  const ids = props.checkStrictly ? [node.id] : collectDescendants(node)
  ids.forEach((id) => (checked ? set.add(id) : set.delete(id)))
  emitSelection([...set])
}

const toggleExpand = (id: string) => {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}

const selectAll = () => {
  const ids: string[] = []
  const walk = (nodes: PermissionNode[]) => {
    nodes.forEach((n) => {
      ids.push(n.id)
      if (n.children) walk(n.children)
    })
  }
  walk(props.tree)
  emitSelection(ids)
}

const clearAll = () => emitSelection([])

interface FlatNode {
  node: PermissionNode
  depth: number
}

const flatTree = computed(() => {
  const result: FlatNode[] = []
  const walk = (nodes: PermissionNode[], depth: number) => {
    nodes.forEach((node) => {
      result.push({ node, depth })
      if (node.children?.length && expanded.value.has(node.id)) {
        walk(node.children, depth + 1)
      }
    })
  }
  walk(props.tree, 0)
  return result
})
</script>

<template>
  <div :class="['vp-permission-panel', props.class, { 'vp-permission-panel--disabled': disabled }]" :style="style" data-component="PermissionPanel">
    <header class="vp-permission-panel__header">
      <h2 class="vp-permission-panel__title">{{ t('component.permission-panel.title') }}</h2>
      <div class="vp-permission-panel__toolbar">
        <Button variant="text" size="sm" :label="t(LocaleKeys.common.all)" :disabled="disabled" @click="selectAll" />
        <Button variant="text" size="sm" :label="t(LocaleKeys.button.reset)" :disabled="disabled" @click="clearAll" />
      </div>
    </header>
    <ul class="vp-permission-panel__tree">
      <li
        v-for="{ node, depth } in flatTree"
        :key="node.id"
        class="vp-permission-panel__row"
        :style="{ paddingInlineStart: `calc(${depth} * var(--spacing-lg))` }"
      >
        <button
          v-if="node.children?.length"
          type="button"
          class="vp-permission-panel__expand"
          :aria-expanded="expanded.has(node.id)"
          @click="toggleExpand(node.id)"
        >
          {{ expanded.has(node.id) ? '-' : '+' }}
        </button>
        <span v-else class="vp-permission-panel__spacer" aria-hidden="true" />
        <Checkbox
          :model-value="selected.has(node.id)"
          :disabled="disabled"
          @update:model-value="(v) => toggle(node, v)"
        >
          {{ node.label }}
        </Checkbox>
      </li>
    </ul>
    <slot />
  </div>
</template>
