<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useCanvasEditor } from '@amg-webui/hooks'
import type { CanvasLayerProps, CanvasLayerEmits } from './types'
import './style.scss'

defineProps<CanvasLayerProps>()
const emit = defineEmits<CanvasLayerEmits>()
const { t } = useLocale()
const editor = useCanvasEditor()

const layers = computed(() => {
  if (!editor) return []
  return [...editor.nodes.value].reverse()
})

function select(id: string) {
  editor?.selectNode(id)
  emit('select', id)
}

function move(id: string, dir: 'up' | 'down' | 'top' | 'bottom') {
  editor?.moveNodeLayer(id, dir)
}

function toggleHidden(id: string) {
  const node = editor?.nodes.value.find((n) => n.id === id)
  if (node) editor?.updateNode(id, { hidden: !node.hidden })
}
</script>

<template>
  <aside class="vp-canvas-layer" data-component="CanvasLayer">
    <h3 class="vp-canvas-layer__title">{{ t('component.canvas-layer.title') }}</h3>
    <ul class="vp-canvas-layer__list">
      <li v-for="node in layers" :key="node.id" :class="['vp-canvas-layer__item', { 'vp-canvas-layer__item--active': editor?.selectedIds.value.includes(node.id) }]">
        <button type="button" class="vp-canvas-layer__name" @click="select(node.id)">{{ node.label }}</button>
        <div class="vp-canvas-layer__actions">
          <button type="button" :title="t('common.previous')" @click="move(node.id, 'up')">↑</button>
          <button type="button" :title="t('common.next')" @click="move(node.id, 'down')">↓</button>
          <button type="button" @click="toggleHidden(node.id)">{{ node.hidden ? t('component.canvas-layer.show') : t('component.canvas-layer.hide') }}</button>
        </div>
      </li>
    </ul>
    <p v-if="!layers.length" class="vp-canvas-layer__muted">{{ t('common.noData') }}</p>
  </aside>
</template>
