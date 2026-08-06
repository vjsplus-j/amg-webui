<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useCanvasEditor } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { CanvasShortcutProps, CanvasShortcutEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<CanvasShortcutProps>(), {
  enabled: true,
  loading: false,
  keyboard: true,
  showCommands: true,
  telemetry: undefined,
  commands: () => [
    { key: 'copy', label: 'Copy', shortcut: 'Ctrl/Cmd + C' },
    { key: 'paste', label: 'Paste', shortcut: 'Ctrl/Cmd + V' },
    { key: 'delete', label: 'Delete', shortcut: 'Delete / Backspace' },
    { key: 'undo', label: 'Undo', shortcut: 'Ctrl/Cmd + Z' },
    { key: 'redo', label: 'Redo', shortcut: 'Ctrl/Cmd + Shift + Z' }
  ]
})
const emit = defineEmits<CanvasShortcutEmits>()
const { t } = useLocale()
const editor = useCanvasEditor()
const titleText = computed(() => props.title ?? t('component.canvas-shortcut.title'))
const descriptionText = computed(() => props.description ?? t('component.canvas-shortcut.lead'))
const commandList = computed(() => props.commands)

function onKeyDown(e: KeyboardEvent) {
  if (!props.keyboard || !props.enabled || !editor || editor.readonly.value) return
  const target = e.target as HTMLElement | null
  if (
    target &&
    (target.isContentEditable ||
      target.closest('input, textarea, select, [contenteditable="true"], .vp-rich-text'))
  ) {
    return
  }
  const mod = e.metaKey || e.ctrlKey
  let command: string | null = null
  if (mod && e.key.toLowerCase() === 'c') {
    e.preventDefault()
    command = 'copy'
    editor.copySelection()
    emit('copy')
  } else if (mod && e.key.toLowerCase() === 'v') {
    e.preventDefault()
    command = 'paste'
    editor.pasteClipboard()
    emit('paste')
  } else if (mod && e.key.toLowerCase() === 'z' && e.shiftKey) {
    e.preventDefault()
    command = 'redo'
    editor.redo()
    emit('redo')
  } else if (mod && e.key.toLowerCase() === 'z') {
    e.preventDefault()
    command = 'undo'
    editor.undo()
    emit('undo')
  } else if ((e.key === 'Delete' || e.key === 'Backspace') && editor.selectedIds.value.length) {
    e.preventDefault()
    command = 'delete'
    editor.removeNodes(editor.selectedIds.value)
    emit('delete')
  }
  if (command) {
    trackEmit({ component: 'CanvasShortcut', type: command, trackId: props.trackId, telemetry: props.telemetry })
    emit('execute', command)
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <section
    :class="['vp-canvas-shortcut', 'vp-canvas-shortcut__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-canvas-shortcut-title"
    :aria-busy="loading || undefined"
    data-component="CanvasShortcut"
  >
    <header class="vp-canvas-shortcut__header">
      <h3 id="vp-canvas-shortcut-title" class="vp-canvas-shortcut__title">{{ titleText }}</h3>
      <div class="vp-canvas-shortcut__status" role="status">
        <span class="vp-canvas-shortcut__badge" :class="{ 'vp-canvas-shortcut__badge--on': enabled, 'vp-canvas-shortcut__badge--off': !enabled }">{{ enabled ? 'ON' : 'OFF' }}</span>
      </div>
    </header>
    <div v-if="loading" class="vp-canvas-shortcut__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-canvas-shortcut__body">
      <p class="vp-canvas-shortcut__muted">{{ descriptionText }}</p>
      <ul v-if="showCommands" class="vp-canvas-shortcut__list" aria-label="Keyboard shortcuts">
        <li v-for="command in commandList" :key="command.key" class="vp-canvas-shortcut__item">
          <span class="vp-canvas-shortcut__label">{{ command.label }}</span>
          <span class="vp-canvas-shortcut__badge vp-canvas-shortcut__badge--off">{{ command.shortcut }}</span>
        </li>
      </ul>
      <slot />
    </div>
  </section>
</template>
