<script setup lang="ts">
import { computed, inject } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { resolveNodeRender } from '../../bindings'
import { type CanvasTreeNode } from '../../tree'
import { LocaleKeys } from '@amg-webui/locale'
import { CANVAS_PREVIEW_KEY } from './context'

defineOptions({ name: 'CanvasPreviewNode' })

const props = defineProps<{
  node: CanvasTreeNode
  nested?: boolean
}>()

const host = inject(CANVAS_PREVIEW_KEY)
const { t } = useLocale()

const nested = computed(() => Boolean(props.nested))
const selected = computed(() => host?.selectedId === props.node.id)
const render = computed(() => resolveNodeRender(props.node, host?.registry))
const showComponent = computed(
  () => host?.renderMode === 'component' && Boolean(host.registry) && Boolean(render.value.component)
)

const style = computed(() => {
  if (!host) return {}
  if (host.mode === 'grid') {
    return {
      gridColumn: `${(props.node.col ?? 0) + 1} / span ${Math.max(1, props.node.colSpan ?? 1)}`,
      gridRow: `${(props.node.row ?? 0) + 1} / span ${Math.max(1, props.node.rowSpan ?? 1)}`,
      minHeight: `${props.node.h}px`,
      zIndex: props.node.zIndex
    }
  }
  if (nested.value) {
    return {
      position: 'relative' as const,
      width: `${props.node.w}px`,
      minHeight: `${props.node.h}px`,
      left: 'auto',
      top: 'auto'
    }
  }
  return {
    left: `${props.node.x}px`,
    top: `${props.node.y}px`,
    width: `${props.node.w}px`,
    minHeight: `${props.node.h}px`,
    zIndex: props.node.zIndex
  }
})

function onActivate(event: MouseEvent | KeyboardEvent) {
  host?.activate(props.node, event)
}
</script>

<template>
  <div
    v-if="host"
    :class="[
      'vp-canvas-preview__node',
      {
        'vp-canvas-preview__node--selected': selected,
        'vp-canvas-preview__node--locked': node.locked,
        'vp-canvas-preview__node--nested': nested,
        'vp-canvas-preview__node--host': node.children.length > 0
      }
    ]"
    :style="style"
    :role="host.interactive ? (host.renderMode === 'component' ? 'group' : 'button') : undefined"
    :tabindex="
      host.interactive &&
      !host.disabled &&
      !node.locked &&
      host.renderMode !== 'component' &&
      !nested
        ? 0
        : undefined
    "
    :aria-pressed="
      host.interactive && host.renderMode !== 'component' ? selected : undefined
    "
    :aria-label="node.label"
    @click.stop="onActivate"
    @keydown.enter="host.renderMode !== 'component' && onActivate($event)"
    @keydown.space="host.renderMode !== 'component' && onActivate($event)"
  >
    <template v-if="showComponent">
      <component :is="render.component" v-bind="render.props" />
    </template>
    <div
      v-else-if="host.renderMode === 'component' && host.registry"
      class="vp-canvas-preview__unknown"
      role="status"
    >
      {{ t(LocaleKeys.component.schemaRenderer.unknown, { type: node.type }) }}
    </div>
    <template v-else>
      <strong>{{ node.label }}</strong>
      <small>{{ node.type }}</small>
    </template>
    <div v-if="node.children.length" class="vp-canvas-preview__children">
      <CanvasPreviewNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        nested
      />
    </div>
  </div>
</template>
