<script setup lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { resolveRuntimeRender } from '../../bindings'
import { type CanvasTreeNode } from '../../tree'
import { LocaleKeys } from '@amg-webui/locale'
import { SCHEMA_RENDERER_KEY } from './context'

defineOptions({ name: 'SchemaNodeRenderer' })

const props = defineProps<{
  node: CanvasTreeNode
  /** Root nodes use free absolute layout; descendants are nested. */
  nested?: boolean
}>()

const host = inject(SCHEMA_RENDERER_KEY)
const { t } = useLocale()

const nested = computed(() => Boolean(props.nested))

const render = computed(() => {
  if (!host) {
    return { component: undefined, props: {}, on: {} as Record<string, (...args: unknown[]) => void> }
  }
  return resolveRuntimeRender(props.node, {
    registry: host.registry,
    context: host.context,
    handlers: host.handlers,
    onNodeEvent: host.onNodeEvent
  })
})

const selected = computed(() => host?.selectedId === props.node.id)
const showComponent = computed(
  () => host?.renderMode === 'component' && Boolean(host.registry) && Boolean(render.value.component)
)
const hasNodeSlot = computed(() => Boolean(host?.nodeSlot))

const NodeSlotView = defineComponent({
  name: 'SchemaNodeSlotView',
  setup() {
    return () =>
      host?.nodeSlot?.({
        node: props.node,
        selected: selected.value
      }) ?? null
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
      'vp-schema-renderer__node',
      {
        'vp-schema-renderer__node--selected': selected,
        'vp-schema-renderer__node--locked': node.locked,
        'vp-schema-renderer__node--nested-host': node.children.length > 0,
        'vp-schema-renderer__node--child': nested
      }
    ]"
    :style="host.nodeStyle(node, nested)"
    :role="
      host.interactive ? (host.renderMode === 'component' ? 'group' : 'button') : undefined
    "
    :tabindex="
      host.interactive &&
      !host.disabled &&
      !node.locked &&
      host.renderMode !== 'component' &&
      !nested
        ? 0
        : undefined
    "
    :aria-selected="host.interactive ? selected : undefined"
    @click.stop="onActivate"
    @keydown.enter="host.renderMode !== 'component' && onActivate($event)"
    @keydown.space="host.renderMode !== 'component' && onActivate($event)"
  >
    <NodeSlotView v-if="hasNodeSlot" />
    <template v-else-if="showComponent">
      <component :is="render.component" v-bind="render.props" v-on="render.on" />
    </template>
    <div
      v-else-if="host.renderMode === 'component' && host.registry"
      class="vp-schema-renderer__unknown"
      role="status"
    >
      {{ t(LocaleKeys.component.schemaRenderer.unknown, { type: node.type }) }}
    </div>
    <template v-else>
      <strong>{{ node.label }}</strong>
      <small>{{ node.type }}</small>
    </template>
    <div v-if="node.children.length" class="vp-schema-renderer__children">
      <SchemaNodeRenderer
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        nested
      />
    </div>
  </div>
</template>
