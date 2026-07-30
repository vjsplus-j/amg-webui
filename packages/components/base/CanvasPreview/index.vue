<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { CanvasPreviewProps, CanvasPreviewEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<CanvasPreviewProps>(), {
  nodes: () => [{ id: 'n1', label: 'Block A', type: 'text', x: 12, y: 12, w: 120, h: 48, props: {} }],
  mode: 'free', loading: false, disabled: false, telemetry: undefined
})
const emit = defineEmits<CanvasPreviewEmits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('component.canvas-preview.lead'))
const visible = computed(() => props.nodes.filter((n) => !n.hidden))

function selectNode(id: string) {
  if (props.disabled) return
  emit('select', id)
  trackEmit({ component: 'CanvasPreview', type: 'select', trackId: props.trackId, telemetry: props.telemetry, payload: { id } })
}

function refresh() {
  emit('refresh')
  trackEmit({ component: 'CanvasPreview', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section :class="['vp-canvas-preview', 'vp-canvas-preview__panel', props.class]" :style="style" role="region" aria-labelledby="vp-canvas-preview-title" data-component="CanvasPreview">
    <header class="vp-canvas-preview__header">
      <h3 id="vp-canvas-preview-title" class="vp-canvas-preview__title">{{ titleText }}</h3>
      <div class="vp-canvas-preview__status" role="status">{{ visible.length }}</div>
    </header>
    <div v-if="loading" class="vp-canvas-preview__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-canvas-preview__body">
      <div :class="['vp-canvas-preview__wrap', { 'vp-canvas-preview--grid': mode === 'grid' }]">
        <div v-for="node in visible" :key="node.id" class="vp-canvas-preview__node" role="button" tabindex="0" :style="{ left: mode === 'free' ? node.x + 'px' : undefined, top: mode === 'free' ? node.y + 'px' : undefined, width: node.w + 'px', minHeight: node.h + 'px' }" @click="selectNode(node.id)" @keydown.enter="selectNode(node.id)">
          <strong>{{ node.label }}</strong><span>{{ node.type }}</span>
        </div>
        <p v-if="!visible.length" class="vp-canvas-preview__empty">{{ t(LocaleKeys.common.noData) }}</p>
      </div>
      <div class="vp-canvas-preview__toolbar">
        <button type="button" class="vp-canvas-preview__btn vp-canvas-preview__btn--ghost" :disabled="disabled" @click="refresh">{{ t(LocaleKeys.button.refresh) }}</button>
      </div>
      <slot />
    </div>
  </section>
</template>
