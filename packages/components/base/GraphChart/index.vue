<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { chartColor } from '@amg-webui/utils/data-display/chartHelpers'
import type { GraphChartProps, GraphChartEmits } from './types'
import './style.scss'

interface GraphNode {
  id: string
  label: string
  x?: number
  y?: number
}
interface GraphEdge {
  from: string
  to: string
}

const props = withDefaults(defineProps<GraphChartProps & { nodes?: GraphNode[]; edges?: GraphEdge[] }>(), {
  nodes: () => [],
  edges: () => [],
  disabled: false
})
defineEmits<GraphChartEmits>()
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
  return {
    nodes: [
      { id: 'a', label: 'A', x: 80, y: 60 },
      { id: 'b', label: 'B', x: 180, y: 40 },
      { id: 'c', label: 'C', x: 240, y: 100 },
      { id: 'd', label: 'D', x: 120, y: 120 }
    ] as GraphNode[],
    edges: [
      { from: 'a', to: 'b' },
      { from: 'b', to: 'c' },
      { from: 'a', to: 'd' }
    ] as GraphEdge[]
  }
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
</script>

<template>
  <div :class="['vp-graph-chart', 'vp-graph-chart__panel', { 'vp-graph-chart--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-graph-chart__title">{{ titleText }}</h3>
    <svg class="vp-graph-chart__chart" viewBox="0 0 320 180" role="img" :aria-label="titleText">
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
      <g v-for="(n, i) in graph.nodes" :key="n.id">
        <circle :cx="n.x" :cy="n.y" r="16" :fill="chartColor(i)" opacity="0.85" />
        <text :x="n.x" :y="n.y! + 4" text-anchor="middle" font-size="10" fill="var(--surface-0)">{{ n.label }}</text>
      </g>
    </svg>
    <slot />
  </div>
</template>
