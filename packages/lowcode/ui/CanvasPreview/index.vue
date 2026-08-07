<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  watch
} from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { buildCanvasTree, rootContentBounds } from '../../tree'
import { trackEmit } from '@amg-webui/telemetry'
import type { CanvasNodeData } from '@amg-webui/utils'
import CanvasPreviewNode from './CanvasPreviewNode.vue'
import { CANVAS_PREVIEW_KEY, type CanvasPreviewHost } from './context'
import type { CanvasPreviewEmits, CanvasPreviewProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<CanvasPreviewProps>(), {
  nodes: () => [],
  modelValue: null,
  mode: 'free',
  scale: 'fit',
  minScale: 0.1,
  maxScale: 2,
  canvasWidth: 960,
  canvasHeight: 540,
  columns: 24,
  showGrid: false,
  loading: false,
  disabled: false,
  interactive: true,
  renderMode: 'chrome',
  telemetry: undefined
})
const emit = defineEmits<CanvasPreviewEmits>()
const { t } = useLocale()
const viewportRef = ref<HTMLElement | null>(null)
const viewportWidth = ref(0)
let resizeObserver: ResizeObserver | null = null

const visibleNodes = computed(() => props.nodes.filter((node) => !node.hidden))
const tree = computed(() => buildCanvasTree(visibleNodes.value))

/** Only roots contribute to free-layout canvas size — nested x/y are parent-local. */
const contentBounds = computed(() =>
  rootContentBounds(visibleNodes.value, {
    width: props.canvasWidth,
    height: props.canvasHeight
  })
)

const actualScale = computed(() => {
  const requested =
    props.scale === 'fit'
      ? viewportWidth.value > 0
        ? viewportWidth.value / contentBounds.value.width
        : 1
      : props.scale
  return Math.min(props.maxScale, Math.max(props.minScale, requested))
})
watch(actualScale, (value) => emit('scaleChange', value), { immediate: true })

function measure() {
  viewportWidth.value = viewportRef.value?.clientWidth ?? 0
}
onMounted(() => {
  if (typeof ResizeObserver !== 'undefined' && viewportRef.value) {
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(viewportRef.value)
  }
  void nextTick(measure)
})
onBeforeUnmount(() => resizeObserver?.disconnect())

const canvasStyle = computed(() => ({
  width: `${contentBounds.value.width}px`,
  height: `${contentBounds.value.height}px`,
  transform: `scale(${actualScale.value})`,
  gridTemplateColumns:
    props.mode === 'grid' ? `repeat(${Math.max(1, props.columns)}, 1fr)` : undefined
}))
const viewportStyle = computed(() => ({
  height: `${contentBounds.value.height * actualScale.value}px`
}))

function activate(node: CanvasNodeData, event: MouseEvent | KeyboardEvent) {
  if (!props.interactive || props.disabled || node.locked) return
  if (event instanceof KeyboardEvent) event.preventDefault()
  emit('update:modelValue', node.id)
  emit('change', node.id)
  emit('select', node.id)
  emit('nodeActivate', node, event)
  trackEmit({
    component: 'CanvasPreview',
    type: 'select',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { id: node.id }
  })
}

function clearSelection(event: MouseEvent) {
  if (!props.interactive || props.disabled || event.target !== event.currentTarget) return
  emit('update:modelValue', null)
  emit('change', null)
}

function refresh() {
  if (props.disabled || props.loading) return
  emit('refresh')
  trackEmit({
    component: 'CanvasPreview',
    type: 'refresh',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
}

const host = reactive({
  get registry() {
    return props.registry
  },
  get renderMode() {
    return props.renderMode
  },
  get mode() {
    return props.mode
  },
  get selectedId() {
    return props.modelValue ?? null
  },
  get interactive() {
    return props.interactive
  },
  get disabled() {
    return props.disabled
  },
  get columns() {
    return props.columns
  },
  activate
}) as CanvasPreviewHost

provide(CANVAS_PREVIEW_KEY, host)
</script>

<template>
  <section
    :class="[
      'vp-canvas-preview',
      { 'vp-canvas-preview--disabled': disabled },
      props.class
    ]"
    :style="style"
    :aria-label="ariaLabel ?? title ?? t('component.canvas-preview.lead')"
    :aria-busy="loading"
    data-component="CanvasPreview"
  >
    <header class="vp-canvas-preview__header">
      <div>
        <h3 class="vp-canvas-preview__title">
          {{ title ?? t('component.canvas-preview.lead') }}
        </h3>
        <span>{{ visibleNodes.length }}</span>
      </div>
      <slot name="actions" :scale="actualScale" :refresh="refresh">
        <button type="button" :disabled="disabled || loading" @click="refresh">
          {{ t('button.refresh') }}
        </button>
      </slot>
    </header>
    <div v-if="loading" class="vp-canvas-preview__state" role="status">
      {{ t('common.loading') }}
    </div>
    <div
      v-else-if="tree.length"
      ref="viewportRef"
      class="vp-canvas-preview__viewport"
      :style="viewportStyle"
    >
      <div
        :class="[
          'vp-canvas-preview__canvas',
          `vp-canvas-preview__canvas--${mode}`,
          { 'vp-canvas-preview__canvas--grid-bg': showGrid }
        ]"
        :style="canvasStyle"
        @click="clearSelection"
      >
        <CanvasPreviewNode v-for="node in tree" :key="node.id" :node="node" />
      </div>
    </div>
    <div v-else class="vp-canvas-preview__state" role="status">
      <slot name="empty">{{ emptyText ?? t('common.noData') }}</slot>
    </div>
  </section>
</template>
