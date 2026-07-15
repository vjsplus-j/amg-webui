<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useCanvasEditor } from '@amg-webui/hooks'
import type { CanvasShortcutProps, CanvasShortcutEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<CanvasShortcutProps>(), {
  enabled: true
})

const emit = defineEmits<CanvasShortcutEmits>()
const editor = useCanvasEditor()

function onKeyDown(e: KeyboardEvent) {
  if (!props.enabled || !editor || editor.readonly.value) return
  const mod = e.metaKey || e.ctrlKey
  if (mod && e.key.toLowerCase() === 'c') {
    emit('copy')
  } else if (mod && e.key.toLowerCase() === 'v') {
    emit('paste')
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    if (editor.selectedIds.value.length) {
      e.preventDefault()
      editor.removeNodes(editor.selectedIds.value)
      emit('delete')
    }
  } else if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) {
    emit('undo')
  } else if (mod && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
    emit('redo')
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div class="vp-canvas-shortcut" data-component="CanvasShortcut" :class="props.class" :style="style">
    <slot />
  </div>
</template>
