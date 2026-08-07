<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useCanvasEditor } from '@amg-webui/hooks'
import type { CanvasLayerProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<CanvasLayerProps>(), {
  compact: false,
  showActions: true
})

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'reorder', payload: { id: string; direction: 'up' | 'down' | 'top' | 'bottom' }): void
  (e: 'visibility-change', payload: { id: string; hidden: boolean }): void
}>()
const { t } = useLocale()
const editor = useCanvasEditor()

const layers = computed(() => {
  if (!editor) return []
  return [...editor.nodes.value].reverse()
})

const rootClass = computed(() => [
  'vp-canvas-layer',
  { 'vp-canvas-layer--compact': props.compact },
  props.class
])

function select(id: string) {
  editor?.selectNode(id)
  emit('select', id)
}

function move(id: string, dir: 'up' | 'down' | 'top' | 'bottom') {
  editor?.moveNodeLayer(id, dir)
  emit('reorder', { id, direction: dir })
}

function toggleHidden(id: string) {
  const node = editor?.nodes.value.find((n) => n.id === id)
  if (node) {
    editor?.updateNode(id, { hidden: !node.hidden })
    emit('visibility-change', { id, hidden: !node.hidden })
  }
}

function onKeydown(e: KeyboardEvent, id: string) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    select(id)
  }
}
</script>

<template>
  <aside
    :class="rootClass"
    :style="style"
    data-component="CanvasLayer"
    role="complementary"
    :aria-label="t('component.canvas-layer.title')"
  >
    <h3 class="vp-canvas-layer__title">{{ t('component.canvas-layer.title') }}</h3>
    <ul class="vp-canvas-layer__list" role="listbox" :aria-label="t('component.canvas-layer.title')">
      <li
        v-for="node in layers"
        :key="node.id"
        :class="[
          'vp-canvas-layer__item',
          {
            'vp-canvas-layer__item--active': editor?.selectedIds.value.includes(node.id),
            'vp-canvas-layer__item--hidden': node.hidden
          }
        ]"
        role="option"
        :aria-selected="editor?.selectedIds.value.includes(node.id)"
      >
        <button
          type="button"
          class="vp-canvas-layer__name"
          @click="select(node.id)"
          @keydown="onKeydown($event, node.id)"
        >
          {{ node.label }}
        </button>
        <div v-if="showActions" class="vp-canvas-layer__actions">
          <button type="button" :title="t('common.previous')" :aria-label="t('common.previous')" @click="move(node.id, 'up')">
            ↑
          </button>
          <button type="button" :title="t('common.next')" :aria-label="t('common.next')" @click="move(node.id, 'down')">
            ↓
          </button>
          <button type="button" :aria-label="node.hidden ? t('component.canvas-layer.show') : t('component.canvas-layer.hide')" @click="toggleHidden(node.id)">
            {{ node.hidden ? t('component.canvas-layer.show') : t('component.canvas-layer.hide') }}
          </button>
        </div>
      </li>
    </ul>
    <p v-if="!layers.length" class="vp-canvas-layer__muted" role="status">{{ t('common.noData') }}</p>
  </aside>
</template>
