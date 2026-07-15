<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { normalizeTreeNodes, type TreeNode } from '@amg-webui/utils/data-display/tree-types'
import type { TreeChartProps, TreeChartEmits } from './types'
import './style.scss'

interface NodePos {
  id: string
  x: number
  y: number
  label: string
  parentId: string | null
}

const props = withDefaults(defineProps<TreeChartProps & { options?: TreeNode[] }>(), {
  options: () => [],
  disabled: false
})
defineEmits<TreeChartEmits>()
const { t } = useLocale()

function layout(nodes: TreeNode[], depth = 0, startX = 0, parentId: string | null = null): { positions: NodePos[]; width: number } {
  const positions: NodePos[] = []
  let x = startX
  const y = 24 + depth * 48
  for (const n of nodes) {
    const id = `${parentId ?? 'r'}/${String(n.value ?? n.label)}`
    if (n.children?.length) {
      const child = layout(n.children, depth + 1, x, id)
      const cx = x + child.width / 2
      positions.push({ id, x: cx, y, label: n.label, parentId })
      positions.push(...child.positions)
      x += child.width + 24
    } else {
      positions.push({ id, x: x + 20, y, label: n.label, parentId })
      x += 48
    }
  }
  return { positions, width: Math.max(48, x - startX) }
}

const roots = computed(() => normalizeTreeNodes(props.data, props.options))
const layoutData = computed(() => layout(roots.value.length ? roots.value : [{ label: 'Root', children: [{ label: 'A' }, { label: 'B' }] }]))
const positions = computed(() => layoutData.value.positions)

const edges = computed(() =>
  positions.value
    .filter((p) => p.parentId)
    .map((p) => {
      const parent = positions.value.find((x) => x.id === p.parentId)
      return parent ? { x1: parent.x, y1: parent.y + 10, x2: p.x, y2: p.y - 10 } : null
    })
    .filter(Boolean) as { x1: number; y1: number; x2: number; y2: number }[]
)

const titleText = computed(() => props.title ?? t('component.tree-chart.title'))
</script>

<template>
  <div :class="['vp-tree-chart', 'vp-tree-chart__panel', { 'vp-tree-chart--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-tree-chart__title">{{ titleText }}</h3>
    <svg class="vp-tree-chart__chart" viewBox="0 0 320 180" role="img" :aria-label="titleText">
      <line
        v-for="(e, i) in edges"
        :key="i"
        :x1="e.x1"
        :y1="e.y1"
        :x2="e.x2"
        :y2="e.y2"
        stroke="var(--ds-border)"
        stroke-width="1"
      />
      <g v-for="p in positions" :key="p.id">
        <circle :cx="p.x" :cy="p.y" r="14" fill="var(--surface-1)" stroke="var(--primary-500)" stroke-width="2" />
        <text :x="p.x" :y="p.y + 28" text-anchor="middle" font-size="10" fill="var(--text-secondary)">{{ p.label }}</text>
      </g>
    </svg>
    <slot />
  </div>
</template>
