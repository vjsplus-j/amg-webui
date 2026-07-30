<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { CanvasNodeData } from '@amg-webui/utils'
import type { DragSortNodeProps, DragSortNodeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragSortNodeProps>(), {
  nodes: () => [
    { id: 'a', label: 'Node A', type: 'box', x: 0, y: 0, w: 80, h: 32, props: {} },
    { id: 'b', label: 'Node B', type: 'box', x: 0, y: 0, w: 80, h: 32, props: {} }
  ],
  loading: false, disabled: false, telemetry: undefined
})
const emit = defineEmits<DragSortNodeEmits>()
const { t } = useLocale()
const list = ref<CanvasNodeData[]>([...props.nodes])
const dragId = ref<string | null>(null)
const titleText = computed(() => props.title ?? t('component.drag-sort-node.title'))

watch(() => props.nodes, (v) => { list.value = [...v] })

function onDragStart(id: string) { dragId.value = id }
function onDrop(targetId: string) {
  if (!dragId.value || dragId.value === targetId || props.disabled) return
  const from = list.value.findIndex((n) => n.id === dragId.value)
  const to = list.value.findIndex((n) => n.id === targetId)
  if (from < 0 || to < 0) return
  const next = [...list.value]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  list.value = next
  dragId.value = null
  emit('reorder', next)
  trackEmit({ component: 'DragSortNode', type: 'reorder', trackId: props.trackId, telemetry: props.telemetry })
}
function clearList() {
  if (props.disabled) return
  list.value = []
  emit('clear')
  trackEmit({ component: 'DragSortNode', type: 'clear', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section class="vp-drag-sort-node vp-drag-sort-node__panel" role="region" aria-labelledby="vp-drag-sort-node-title" data-component="DragSortNode">
    <header class="vp-drag-sort-node__header">
      <h3 id="vp-drag-sort-node-title" class="vp-drag-sort-node__title">{{ titleText }}</h3>
    </header>
    <div v-if="loading" class="vp-drag-sort-node__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <ul v-else class="vp-drag-sort-node__list" role="listbox">
      <li v-for="node in list" :key="node.id" class="vp-drag-sort-node__item" draggable="true" role="option" @dragstart="onDragStart(node.id)" @dragover.prevent @drop="onDrop(node.id)">{{ node.label }}</li>
      <p v-if="!list.length" class="vp-drag-sort-node__empty">{{ t(LocaleKeys.common.noData) }}</p>
    </ul>
    <div class="vp-drag-sort-node__toolbar">
      <button type="button" class="vp-drag-sort-node__btn vp-drag-sort-node__btn--ghost" :disabled="disabled" @click="clearList">{{ t(LocaleKeys.button.reset) }}</button>
    </div>
  </section>
</template>
