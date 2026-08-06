<script setup lang="ts">
import { computed, ref } from "vue";
import { useCanvasEditor } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import type { CanvasNodeProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<CanvasNodeProps>(), {
  selectable: true,
  draggable: true,
  keyboardStep: 1,
  telemetry: undefined,
});

const emit = defineEmits<{
  (e: "select", id: string): void;
  (e: "move", payload: { id: string; x: number; y: number }): void;
  (e: "moveStart", payload: { id: string; x: number; y: number }): void;
  (e: "moveEnd", payload: { id: string; x: number; y: number }): void;
}>();
const editor = useCanvasEditor();

const dragging = ref(false);
const start = ref({ x: 0, y: 0, nx: 0, ny: 0 });

const selected = computed(
  () => editor?.selectedIds.value.includes(props.node.id) ?? false,
);

const style = computed(() => ({
  left: `${props.node.x}px`,
  top: `${props.node.y}px`,
  width: `${props.node.w}px`,
  minHeight: `${props.node.h}px`,
  zIndex: String(props.node.zIndex ?? 1),
}));

const rootClass = computed(() => [
  "vp-canvas-node",
  {
    "vp-canvas-node--selected": selected.value,
    "vp-canvas-node--locked": props.node.locked,
    "vp-canvas-node--hidden": props.node.hidden,
  },
]);

function onClick(e: MouseEvent) {
  if (!props.selectable) return;
  e.stopPropagation();
  editor?.selectNode(props.node.id, e.shiftKey);
  emit("select", props.node.id);
}

function onPointerDown(e: PointerEvent) {
  if (!props.draggable || !editor || editor.readonly.value || props.node.locked)
    return;
  dragging.value = true;
  start.value = {
    x: e.clientX,
    y: e.clientY,
    nx: props.node.x,
    ny: props.node.y,
  };
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  emit("moveStart", { id: props.node.id, x: props.node.x, y: props.node.y });
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || !editor) return;
  const x = start.value.nx + (e.clientX - start.value.x);
  const y = start.value.ny + (e.clientY - start.value.y);
  editor.updateNode(props.node.id, { x, y });
  emit("move", { id: props.node.id, x, y });
}

function onPointerUp(e: PointerEvent) {
  dragging.value = false;
  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  emit("moveEnd", { id: props.node.id, x: props.node.x, y: props.node.y });
  trackEmit({
    component: "CanvasNode",
    type: "moveEnd",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { id: props.node.id, x: props.node.x, y: props.node.y },
  });
}

function onKeydown(e: KeyboardEvent) {
  if (!props.selectable) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    editor?.selectNode(props.node.id, e.shiftKey);
    emit("select", props.node.id);
    return;
  }
  if (!props.draggable || !editor || editor.readonly.value || props.node.locked)
    return;
  const delta = (e.shiftKey ? 10 : 1) * props.keyboardStep;
  let x = props.node.x;
  let y = props.node.y;
  if (e.key === "ArrowLeft") x -= delta;
  else if (e.key === "ArrowRight") x += delta;
  else if (e.key === "ArrowUp") y -= delta;
  else if (e.key === "ArrowDown") y += delta;
  else return;
  e.preventDefault();
  editor.updateNode(props.node.id, { x, y });
  emit("move", { id: props.node.id, x, y });
}
</script>

<template>
  <div
    :class="[rootClass, props.class]"
    :style="[style, props.style]"
    data-component="CanvasNode"
    role="button"
    :tabindex="selectable ? 0 : -1"
    :aria-selected="selected"
    :aria-label="node.label"
    @click="onClick"
    @keydown="onKeydown"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <span class="vp-canvas-node__label">{{ node.label }}</span>
    <span class="vp-canvas-node__type">{{ node.type }}</span>
    <slot />
  </div>
</template>
