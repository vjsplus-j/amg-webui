<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale, provideCanvasEditor } from '@amg-webui/hooks'
import { buildCanvasTree } from '../../tree'
import { createCanvasNode } from '@amg-webui/utils'
import type { CanvasNodeData } from '@amg-webui/utils'
import CanvasNode from '../CanvasNode/index.vue'
import type { DragCanvasProps, DragCanvasEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragCanvasProps>(), {
  modelValue: () => [],
  mode: 'free',
  readonly: false,
  materials: () => [],
  gridCols: 24,
  renderMode: 'chrome'
})

const emit = defineEmits<DragCanvasEmits>()
const { t } = useLocale()

const nodes = ref<CanvasNodeData[]>([...props.modelValue])
const modeRef = ref(props.mode)
const readonlyRef = ref(props.readonly)

watch(
  () => props.modelValue,
  (v) => {
    nodes.value = [...v]
  }
)

watch(
  () => props.mode,
  (v) => {
    modeRef.value = v
  }
)

const editor = provideCanvasEditor({
  nodes,
  mode: modeRef,
  readonly: readonlyRef,
  onChange: () => {
    // New array identity so parent v-model + SchemaRenderer recompute reliably
    emit('update:modelValue', nodes.value.slice())
    emit('change', nodes.value.slice())
    emit('select', editor.selectedIds.value)
  }
})

const tree = computed(() => buildCanvasTree(nodes.value.filter((n) => !n.hidden)))

const gridStyle = computed(() => ({
  backgroundSize: `${100 / props.gridCols}% ${100 / 12}%`
}))

function onDrop(e: DragEvent) {
  e.preventDefault()
  if (props.readonly) return
  const type = e.dataTransfer?.getData('application/vp-material-type')
  const label = e.dataTransfer?.getData('application/vp-material-label') || type || 'Node'
  if (!type) return
  const materialRaw = e.dataTransfer?.getData('application/vp-material')
  let defaultProps: Record<string, unknown> = {}
  let defaultSize: { w: number; h: number } | undefined
  if (materialRaw) {
    try {
      const parsed = JSON.parse(materialRaw) as {
        defaultProps?: Record<string, unknown>
        defaultSize?: { w: number; h: number }
        label?: string
      }
      defaultProps = parsed.defaultProps ?? {}
      defaultSize = parsed.defaultSize
    } catch {
      /* ignore bad payload */
    }
  }
  const fromList = props.materials.find((m) => m.type === type)
  if (fromList?.defaultProps) defaultProps = { ...fromList.defaultProps, ...defaultProps }
  if (fromList?.defaultSize) defaultSize = fromList.defaultSize
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const node = createCanvasNode(type, fromList?.label || label, {
    x: e.clientX - rect.left - 40,
    y: e.clientY - rect.top - 20,
    w: defaultSize?.w,
    h: defaultSize?.h,
    props: { ...defaultProps }
  })
  editor.addNode(node)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
}

function onCanvasClick() {
  editor.clearSelection()
  emit('select', [])
}
</script>

<template>
  <div role="region" aria-label="DragCanvas" :class="['vp-drag-canvas', { 'vp-drag-canvas--readonly': readonly, 'vp-drag-canvas--grid': mode === 'grid' }, props.class]" :style="style" data-component="DragCanvas">
    <div
      class="vp-drag-canvas__surface"
      :style="gridStyle"
      @dragover="onDragOver"
      @drop="onDrop"
      @click.self="onCanvasClick"
    >
      <CanvasNode
        v-for="node in tree"
        :key="node.id"
        :node="node"
        :children="node.children"
        :registry="registry"
        :render-mode="renderMode"
      />
      <p v-if="!nodes.length" class="vp-drag-canvas__empty">{{ t('component.drag-canvas.empty') }}</p>
    </div>
    <slot />
  </div>
</template>
