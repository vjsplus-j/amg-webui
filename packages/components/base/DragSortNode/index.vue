<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { CanvasNodeData } from '@amg-webui/utils'
import type { DragSortNodeProps, DragSortNodeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragSortNodeProps>(), {
  nodes: () => []
})

const emit = defineEmits<DragSortNodeEmits>()
const { t } = useLocale()
const list = ref<CanvasNodeData[]>([...props.nodes])
const dragId = ref<string | null>(null)

watch(
  () => props.nodes,
  (v) => {
    list.value = [...v]
  }
)

function onDragStart(id: string) {
  dragId.value = id
}

function onDrop(targetId: string) {
  if (!dragId.value || dragId.value === targetId) return
  const from = list.value.findIndex((n) => n.id === dragId.value)
  const to = list.value.findIndex((n) => n.id === targetId)
  if (from < 0 || to < 0) return
  const next = [...list.value]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  list.value = next
  dragId.value = null
  emit('reorder', next)
}
</script>

<template>
  <ul :class="['vp-drag-sort-node', props.class]" :style="style" data-component="DragSortNode">
    <li
      v-for="node in list"
      :key="node.id"
      class="vp-drag-sort-node__item"
      draggable="true"
      @dragstart="onDragStart(node.id)"
      @dragover.prevent
      @drop="onDrop(node.id)"
    >
      {{ node.label }}
    </li>
    <p v-if="!list.length" class="vp-drag-sort-node__muted">{{ t('common.noData') }}</p>
  </ul>
</template>
