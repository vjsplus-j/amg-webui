<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { chartColor } from '@amg-webui/utils/data-display/chartHelpers'
import type { GraphChartProps, GraphChartEmits, GraphChartNode as GraphNode, GraphChartEdge as GraphEdge } from './types'
import './style.scss'

const props = withDefaults(defineProps<GraphChartProps>(), {
  nodes: () => [],
  edges: () => [],
  disabled: false,
  loading: false,
  selectable: true,
  telemetry: undefined
})
const emit = defineEmits<GraphChartEmits>()
const { t } = useLocale()

const graph = computed(() => {
  if (props.nodes?.length) {
    return {
      nodes: props.nodes.map((n, i) => ({
        ...n,
        x: n.x ?? 60 + (i % 4) * 70,
        y: n.y ?? 40 + Math.floor(i / 4) * 60
      })),
      edges: props.edges ?? []
    }
  }
  if (props.data && typeof props.data === 'object') {
    const d = props.data as { nodes?: GraphNode[]; edges?: GraphEdge[] }
    return { nodes: d.nodes ?? [], edges: d.edges ?? [] }
  }
  return { nodes: [] as GraphNode[], edges: [] as GraphEdge[] }
})

const nodeMap = computed(() => new Map(graph.value.nodes.map((n) => [n.id, n])))

const lines = computed(() =>
  graph.value.edges
    .map((e) => {
      const a = nodeMap.value.get(e.from)
      const b = nodeMap.value.get(e.to)
      if (!a || !b) return null
      return { x1: a.x!, y1: a.y!, x2: b.x!, y2: b.y! }
    })
    .filter(Boolean) as { x1: number; y1: number; x2: number; y2: number }[]
)

const titleText = computed(() => props.title ?? t('component.graph-chart.title'))
const emptyText = computed(() => props.emptyText ?? t('common.noData'))

function selectNode(node: GraphNode, event?: MouseEvent | KeyboardEvent) {
  if (props.disabled || props.loading || !props.selectable) return
  emit('update:modelValue', node.id)
  emit('change', node)
  emit('select', node, event)
  if (event instanceof MouseEvent) emit('click', event)
}

function onKeydown(event: KeyboardEvent, node: GraphNode) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  selectNode(node, event)
}
</script>

<template>
  <div :class="['vp-graph-chart', 'vp-graph-chart__panel', { 'vp-graph-chart--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-graph-chart__title">{{ titleText }}</h3>
    <p v-if="loading" class="vp-graph-chart__muted" role="status">{{ t('common.loading') }}</p>
    <p v-else-if="!graph.nodes.length" class="vp-graph-chart__muted" role="status">{{ emptyText }}</p>
    <svg v-else class="vp-graph-chart__chart" viewBox="0 0 320 180" role="img" :aria-label="titleText">
      <line
        v-for="(ln, i) in lines"
        :key="i"
        :x1="ln.x1"
        :y1="ln.y1"
        :x2="ln.x2"
        :y2="ln.y2"
        stroke="var(--ds-border)"
        stroke-width="2"
      />
      <g v-for="(n, i) in graph.nodes" :key="n.id" class="vp-graph-chart__node" :class="{ 'vp-graph-chart__node--selected': modelValue === n.id }" role="button" :tabindex="selectable && !disabled ? 0 : -1" :aria-label="n.label" @click="selectNode(n, $event)" @keydown="onKeydown($event, n)">
        <circle :cx="n.x" :cy="n.y" r="16" :fill="chartColor(i)" opacity="0.85" />
        <text :x="n.x" :y="n.y! + 4" text-anchor="middle" font-size="10" fill="var(--surface-0)">{{ n.label }}</text>
      </g>
    </svg>
    <slot />
  </div>
</template>
