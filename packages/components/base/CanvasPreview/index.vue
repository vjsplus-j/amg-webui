<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { CanvasPreviewProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<CanvasPreviewProps>(), {
  nodes: () => [],
  mode: 'free'
})

const { t } = useLocale()

const visible = computed(() => props.nodes.filter((n) => !n.hidden))
</script>

<template>
  <div
    :class="['vp-canvas-preview', { 'vp-canvas-preview--grid': mode === 'grid' }, props.class]"
    :style="style"
    data-component="CanvasPreview"
  >
    <div
      v-for="node in visible"
      :key="node.id"
      class="vp-canvas-preview__node"
      :style="{
        left: mode === 'free' ? `${node.x}px` : undefined,
        top: mode === 'free' ? `${node.y}px` : undefined,
        width: `${node.w}px`,
        minHeight: `${node.h}px`,
        gridColumn: mode === 'grid' ? `span ${node.colSpan ?? 8}` : undefined
      }"
    >
      <strong>{{ node.label }}</strong>
      <span>{{ node.type }}</span>
      <slot :node="node" />
    </div>
    <p v-if="!visible.length" class="vp-canvas-preview__muted">{{ t('component.canvas-preview.lead') }}</p>
  </div>
</template>
