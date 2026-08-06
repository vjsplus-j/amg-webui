<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { buildCanvasTree, resolveNodeRender } from '@amg-webui/lowcode'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import type { CanvasNodeData, CanvasSchema } from '@amg-webui/utils'
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
  telemetry: undefined
})

const emit = defineEmits<SchemaRendererEmits>()
const { t } = useLocale()

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

const surfaceStyle = computed(() =>
  layoutMode.value === 'grid'
    ? { gridTemplateColumns: `repeat(${Math.max(1, props.columns)}, 1fr)` }
    : undefined
)

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

function renderOf(node: CanvasNodeData) {
  return resolveNodeRender(node, props.registry)
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
      <div
        v-for="node in tree"
        :key="node.id"
        :class="[
          'vp-schema-renderer__node',
          {
            'vp-schema-renderer__node--selected': selectedId === node.id,
            'vp-schema-renderer__node--locked': node.locked,
            'vp-schema-renderer__node--nested-host': node.children.length > 0
          }
        ]"
        :style="nodeStyle(node, false)"
        :role="interactive ? (renderMode === 'component' ? 'group' : 'button') : undefined"
        :tabindex="
          interactive && !disabled && !node.locked && renderMode !== 'component' ? 0 : undefined
        "
        :aria-selected="interactive ? selectedId === node.id : undefined"
        @click.stop="activate(node, $event)"
        @keydown.enter="renderMode !== 'component' && activate(node, $event)"
        @keydown.space="renderMode !== 'component' && activate(node, $event)"
      >
        <slot name="node" :node="node" :selected="selectedId === node.id">
          <template v-if="renderMode === 'component' && registry">
            <component
              :is="renderOf(node).component"
              v-bind="renderOf(node).props"
              v-if="renderOf(node).component"
            />
            <div v-else class="vp-schema-renderer__unknown" role="status">
              {{ t(LocaleKeys.component.schemaRenderer.unknown, { type: node.type }) }}
            </div>
          </template>
          <template v-else>
            <strong>{{ node.label }}</strong>
            <small>{{ node.type }}</small>
          </template>
        </slot>
        <div v-if="node.children.length" class="vp-schema-renderer__children">
          <div
            v-for="child in node.children"
            :key="child.id"
            :class="[
              'vp-schema-renderer__node',
              'vp-schema-renderer__node--child',
              {
                'vp-schema-renderer__node--selected': selectedId === child.id,
                'vp-schema-renderer__node--locked': child.locked
              }
            ]"
            :style="nodeStyle(child, true)"
            role="group"
            @click.stop="activate(child, $event)"
          >
            <slot name="node" :node="child" :selected="selectedId === child.id">
              <template v-if="renderMode === 'component' && registry">
                <component
                  :is="renderOf(child).component"
                  v-bind="renderOf(child).props"
                  v-if="renderOf(child).component"
                />
                <div v-else class="vp-schema-renderer__unknown" role="status">
                  {{ t(LocaleKeys.component.schemaRenderer.unknown, { type: child.type }) }}
                </div>
              </template>
              <template v-else>
                <strong>{{ child.label }}</strong>
                <small>{{ child.type }}</small>
              </template>
            </slot>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="vp-schema-renderer__empty" role="status">
      <slot name="empty">{{ emptyText ?? t(LocaleKeys.component.schemaRenderer.empty) }}</slot>
    </div>
  </div>
</template>
