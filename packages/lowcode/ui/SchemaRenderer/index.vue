<script setup lang="ts">
import { computed, provide, reactive, useSlots, type Slot } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { buildCanvasTree, rootContentBounds } from '../../tree'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import type { CanvasNodeData, CanvasSchema } from '@amg-webui/utils'
import type { LowcodeNodeEventPayload } from '../../types'
import {
  SCHEMA_RENDERER_KEY,
  type SchemaNodeSlotProps,
  type SchemaRendererContext
} from './context'
import SchemaNodeRenderer from './SchemaNodeRenderer.vue'
import type { SchemaRendererEmits, SchemaRendererProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<SchemaRendererProps>(), {
  schema: null,
  nodes: () => [],
  mode: 'free',
  renderMode: 'component',
  columns: 24,
  selectedId: null,
  interactive: true,
  disabled: false,
  context: undefined,
  handlers: undefined,
  telemetry: undefined
})

const emit = defineEmits<SchemaRendererEmits>()
const { t } = useLocale()
const slots = useSlots()

function resolveNodeSlot(): Slot<SchemaNodeSlotProps> | undefined {
  const node = Reflect.get(slots, 'node')
  return typeof node === 'function' ? (node as Slot<SchemaNodeSlotProps>) : undefined
}

const flatNodes = computed(() => {
  if (props.schema && !Array.isArray(props.schema)) {
    return (props.schema as CanvasSchema).nodes.filter((n) => !n.hidden)
  }
  if (Array.isArray(props.schema)) {
    return props.schema.filter((n) => !n.hidden)
  }
  return props.nodes.filter((n) => !n.hidden)
})

const tree = computed(() => buildCanvasTree(flatNodes.value))

const layoutMode = computed(() => {
  if (props.schema && !Array.isArray(props.schema)) return props.schema.mode
  return props.mode
})

const surfaceStyle = computed(() => {
  if (layoutMode.value === 'grid') {
    return { gridTemplateColumns: `repeat(${Math.max(1, props.columns)}, 1fr)` }
  }
  const bounds = rootContentBounds(flatNodes.value, { width: 320, height: 200 })
  return {
    position: 'relative' as const,
    minHeight: `${bounds.height}px`,
    height: `${bounds.height}px`,
    width: '100%'
  }
})

function nodeStyle(node: CanvasNodeData, nested: boolean) {
  if (layoutMode.value === 'grid') {
    return {
      gridColumn: `${(node.col ?? 0) + 1} / span ${Math.max(1, node.colSpan ?? 1)}`,
      gridRow: `${(node.row ?? 0) + 1} / span ${Math.max(1, node.rowSpan ?? 1)}`,
      minHeight: `${node.h}px`,
      zIndex: node.zIndex
    }
  }
  if (nested) {
    return {
      position: 'relative' as const,
      width: `${node.w}px`,
      minHeight: `${node.h}px`,
      left: 'auto',
      top: 'auto'
    }
  }
  return {
    left: `${node.x}px`,
    top: `${node.y}px`,
    width: `${node.w}px`,
    height: `${node.h}px`,
    zIndex: node.zIndex
  }
}

function activate(node: CanvasNodeData, event: MouseEvent | KeyboardEvent) {
  if (!props.interactive || props.disabled || node.locked) return
  if (event instanceof KeyboardEvent) event.preventDefault()
  emit('select', node.id)
  emit('nodeActivate', node, event)
  trackEmit({
    component: 'SchemaRenderer',
    type: 'select',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { id: node.id, type: node.type }
  })
}

function onNodeEvent(payload: LowcodeNodeEventPayload) {
  emit('nodeEvent', payload)
  trackEmit({
    component: 'SchemaRenderer',
    type: 'nodeEvent',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { id: payload.nodeId, event: payload.event, handler: payload.handler }
  })
}

const rendererCtx = reactive({
  get registry() {
    return props.registry
  },
  get renderMode() {
    return props.renderMode
  },
  get selectedId() {
    return props.selectedId ?? null
  },
  get interactive() {
    return props.interactive
  },
  get disabled() {
    return props.disabled
  },
  get context() {
    return props.context
  },
  get handlers() {
    return props.handlers
  },
  get trackId() {
    return props.trackId
  },
  get telemetry() {
    return props.telemetry
  },
  get nodeSlot() {
    return resolveNodeSlot()
  },
  nodeStyle,
  activate,
  onNodeEvent
}) as SchemaRendererContext

provide(SCHEMA_RENDERER_KEY, rendererCtx)
</script>

<template>
  <div
    :class="[
      'vp-schema-renderer',
      `vp-schema-renderer--${layoutMode}`,
      { 'vp-schema-renderer--disabled': disabled },
      props.class
    ]"
    :style="[style, surfaceStyle]"
    data-component="SchemaRenderer"
  >
    <template v-if="tree.length">
      <SchemaNodeRenderer v-for="node in tree" :key="node.id" :node="node" />
    </template>
    <div v-else class="vp-schema-renderer__empty" role="status">
      <slot name="empty">{{ emptyText ?? t(LocaleKeys.component.schemaRenderer.empty) }}</slot>
    </div>
  </div>
</template>
