<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useCanvasEditor } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { CanvasShortcutProps, CanvasShortcutEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<CanvasShortcutProps>(), { enabled: true, loading: false, telemetry: undefined })
const emit = defineEmits<CanvasShortcutEmits>()
const { t } = useLocale()
const editor = useCanvasEditor()
const titleText = computed(() => props.title ?? t('component.canvas-shortcut.title'))

function onKeyDown(e: KeyboardEvent) {
  if (!props.enabled || !editor || editor.readonly.value) return
  const mod = e.metaKey || e.ctrlKey
  if (mod && e.key.toLowerCase() === 'c') { emit('copy'); trackEmit({ component: 'CanvasShortcut', type: 'copy', trackId: props.trackId, telemetry: props.telemetry }) }
  else if (mod && e.key.toLowerCase() === 'v') { emit('paste'); trackEmit({ component: 'CanvasShortcut', type: 'paste', trackId: props.trackId, telemetry: props.telemetry }) }
  else if ((e.key === 'Delete' || e.key === 'Backspace') && editor.selectedIds.value.length) { e.preventDefault(); editor.removeNodes(editor.selectedIds.value); emit('delete'); trackEmit({ component: 'CanvasShortcut', type: 'delete', trackId: props.trackId, telemetry: props.telemetry }) }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <section :class="['vp-canvas-shortcut', 'vp-canvas-shortcut__panel', props.class]" :style="style" role="region" aria-labelledby="vp-canvas-shortcut-title" data-component="CanvasShortcut">
    <header class="vp-canvas-shortcut__header">
      <h3 id="vp-canvas-shortcut-title" class="vp-canvas-shortcut__title">{{ titleText }}</h3>
      <div class="vp-canvas-shortcut__status" role="status">{{ enabled ? 'ON' : 'OFF' }}</div>
    </header>
    <div v-if="loading" class="vp-canvas-shortcut__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-canvas-shortcut__body">
      <p class="vp-canvas-shortcut__muted">{{ t('component.canvas-shortcut.lead') }}</p>
      <slot />
    </div>
  </section>
</template>
