<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useLocale } from "@amg-webui/hooks";
import { resolveNodeRender } from "@amg-webui/lowcode";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import type { CanvasNodeData } from "@amg-webui/utils";
import type { CanvasPreviewEmits, CanvasPreviewProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<CanvasPreviewProps>(), {
  nodes: () => [],
  modelValue: null,
  mode: "free",
  scale: "fit",
  minScale: 0.1,
  maxScale: 2,
  canvasWidth: 960,
  canvasHeight: 540,
  columns: 24,
  showGrid: false,
  loading: false,
  disabled: false,
  interactive: true,
  renderMode: "chrome",
  telemetry: undefined,
});
const emit = defineEmits<CanvasPreviewEmits>();
const { t } = useLocale();
const viewportRef = ref<HTMLElement | null>(null);
const viewportWidth = ref(0);
let resizeObserver: ResizeObserver | null = null;
const visibleNodes = computed(() => props.nodes.filter((node) => !node.hidden));
const contentBounds = computed(() => ({
  width: Math.max(
    props.canvasWidth,
    ...visibleNodes.value.map((node) => node.x + node.w),
    1,
  ),
  height: Math.max(
    props.canvasHeight,
    ...visibleNodes.value.map((node) => node.y + node.h),
    1,
  ),
}));
const actualScale = computed(() => {
  const requested =
    props.scale === "fit"
      ? viewportWidth.value > 0
        ? viewportWidth.value / contentBounds.value.width
        : 1
      : props.scale;
  return Math.min(props.maxScale, Math.max(props.minScale, requested));
});
watch(actualScale, (value) => emit("scaleChange", value), { immediate: true });
function measure() {
  viewportWidth.value = viewportRef.value?.clientWidth ?? 0;
}
onMounted(() => {
  if (typeof ResizeObserver !== "undefined" && viewportRef.value) {
    resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewportRef.value);
  }
  void nextTick(measure);
});
onBeforeUnmount(() => resizeObserver?.disconnect());

const canvasStyle = computed(() => ({
  width: `${contentBounds.value.width}px`,
  height: `${contentBounds.value.height}px`,
  transform: `scale(${actualScale.value})`,
  gridTemplateColumns:
    props.mode === "grid"
      ? `repeat(${Math.max(1, props.columns)}, 1fr)`
      : undefined,
}));
const viewportStyle = computed(() => ({
  height: `${contentBounds.value.height * actualScale.value}px`,
}));
function nodeStyle(node: CanvasNodeData) {
  if (props.mode === "grid")
    return {
      gridColumn: `${(node.col ?? 0) + 1} / span ${Math.max(1, node.colSpan ?? 1)}`,
      gridRow: `${(node.row ?? 0) + 1} / span ${Math.max(1, node.rowSpan ?? 1)}`,
      minHeight: `${node.h}px`,
      zIndex: node.zIndex,
    };
  return {
    left: `${node.x}px`,
    top: `${node.y}px`,
    width: `${node.w}px`,
    height: `${node.h}px`,
    zIndex: node.zIndex,
  };
}
function activate(node: CanvasNodeData, event: MouseEvent | KeyboardEvent) {
  if (!props.interactive || props.disabled || node.locked) return;
  if (event instanceof KeyboardEvent) event.preventDefault();
  emit("update:modelValue", node.id);
  emit("change", node.id);
  emit("select", node.id);
  emit("nodeActivate", node, event);
  trackEmit({
    component: "CanvasPreview",
    type: "select",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { id: node.id },
  });
}
function clearSelection(event: MouseEvent) {
  if (
    !props.interactive ||
    props.disabled ||
    event.target !== event.currentTarget
  )
    return;
  emit("update:modelValue", null);
  emit("change", null);
}
function refresh() {
  if (props.disabled || props.loading) return;
  emit("refresh");
  trackEmit({
    component: "CanvasPreview",
    type: "refresh",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}

function renderOf(node: CanvasNodeData) {
  return resolveNodeRender(node, props.registry);
}
</script>

<template>
  <section
    :class="[
      'vp-canvas-preview',
      { 'vp-canvas-preview--disabled': disabled },
      props.class,
    ]"
    :style="style"
    :aria-label="ariaLabel ?? title ?? t('component.canvas-preview.lead')"
    :aria-busy="loading"
    data-component="CanvasPreview"
  >
    <header class="vp-canvas-preview__header">
      <div>
        <h3 class="vp-canvas-preview__title">
          {{ title ?? t("component.canvas-preview.lead") }}
        </h3>
        <span>{{ visibleNodes.length }}</span>
      </div>
      <slot name="actions" :scale="actualScale" :refresh="refresh">
        <button type="button" :disabled="disabled || loading" @click="refresh">
          {{ t("button.refresh") }}
        </button>
      </slot>
    </header>
    <div v-if="loading" class="vp-canvas-preview__state" role="status">
      {{ t("common.loading") }}
    </div>
    <div
      v-else-if="visibleNodes.length"
      ref="viewportRef"
      class="vp-canvas-preview__viewport"
      :style="viewportStyle"
    >
      <div
        :class="[
          'vp-canvas-preview__canvas',
          `vp-canvas-preview__canvas--${mode}`,
          { 'vp-canvas-preview__canvas--grid-bg': showGrid },
        ]"
        :style="canvasStyle"
        @click="clearSelection"
      >
        <div
          v-for="node in visibleNodes"
          :key="node.id"
          :class="[
            'vp-canvas-preview__node',
            {
              'vp-canvas-preview__node--selected': modelValue === node.id,
              'vp-canvas-preview__node--locked': node.locked,
            },
          ]"
          :style="nodeStyle(node)"
          :role="interactive ? (renderMode === 'component' ? 'group' : 'button') : undefined"
          :tabindex="
            interactive && !disabled && !node.locked && renderMode !== 'component' ? 0 : undefined
          "
          :aria-selected="interactive ? modelValue === node.id : undefined"
          @click.stop="activate(node, $event)"
          @keydown.enter="renderMode !== 'component' && activate(node, $event)"
          @keydown.space="renderMode !== 'component' && activate(node, $event)"
        >
          <slot name="node" :node="node" :selected="modelValue === node.id">
            <template v-if="renderMode === 'component' && registry">
              <component
                :is="renderOf(node).component"
                v-bind="renderOf(node).props"
                v-if="renderOf(node).component"
              />
              <div v-else class="vp-canvas-preview__unknown" role="status">
                {{ t(LocaleKeys.component.schemaRenderer.unknown, { type: node.type }) }}
              </div>
            </template>
            <template v-else>
              <strong>{{ node.label }}</strong>
              <small>{{ node.type }}</small>
            </template>
          </slot>
        </div>
      </div>
    </div>
    <div v-else class="vp-canvas-preview__state" role="status">
      <slot name="empty">{{ emptyText ?? t("common.noData") }}</slot>
    </div>
  </section>
</template>
