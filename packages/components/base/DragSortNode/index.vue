<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import type { CanvasNodeData } from "@amg-webui/utils";
import type { DragSortNodeEmits, DragSortNodeProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<DragSortNodeProps>(), {
  nodes: () => [],
  loading: false,
  disabled: false,
  clearable: true,
  telemetry: undefined,
});
const emit = defineEmits<DragSortNodeEmits>();
const { t } = useLocale();
const source = computed(() => props.modelValue ?? props.nodes);
const list = ref<CanvasNodeData[]>([...source.value]);
const draggingId = ref<string | null>(null);
watch(
  source,
  (value) => {
    list.value = [...value];
  },
  { deep: true },
);

function commit(
  next: CanvasNodeData[],
  moved?: { node: CanvasNodeData; from: number; to: number },
) {
  list.value = next;
  emit("update:modelValue", next);
  emit("change", next);
  emit("reorder", next);
  if (moved) emit("move", moved.node, moved.from, moved.to);
  trackEmit({
    component: "DragSortNode",
    type: "reorder",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { from: moved?.from, to: moved?.to, count: next.length },
  });
}
function move(from: number, to: number) {
  if (
    props.disabled ||
    from < 0 ||
    to < 0 ||
    from >= list.value.length ||
    to >= list.value.length
  )
    return;
  const node = list.value[from];
  if (node.locked || from === to) return;
  const next = [...list.value];
  next.splice(from, 1);
  next.splice(to, 0, node);
  commit(next, { node, from, to });
}
function dragStart(node: CanvasNodeData, event: DragEvent) {
  if (props.disabled || node.locked) {
    event.preventDefault();
    return;
  }
  draggingId.value = node.id;
  event.dataTransfer?.setData("text/plain", node.id);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  emit("dragStart", node, event);
}
function drop(targetIndex: number) {
  const from = list.value.findIndex((node) => node.id === draggingId.value);
  move(from, targetIndex);
  draggingId.value = null;
}
function dragEnd(node: CanvasNodeData, event: DragEvent) {
  draggingId.value = null;
  emit("dragEnd", node, event);
}
function keydown(event: KeyboardEvent, index: number) {
  const key = event.key;
  let to = index;
  if (key === "ArrowUp" || key === "ArrowLeft") to = index - 1;
  else if (key === "ArrowDown" || key === "ArrowRight") to = index + 1;
  else if (key === "Home") to = 0;
  else if (key === "End") to = list.value.length - 1;
  else return;
  event.preventDefault();
  move(index, to);
}
function select(node: CanvasNodeData) {
  if (props.disabled) return;
  emit("update:selectedId", node.id);
  emit("select", node);
}
function clear() {
  if (props.disabled || props.loading || !list.value.length) return;
  list.value = [];
  emit("update:modelValue", []);
  emit("change", []);
  emit("clear");
  trackEmit({
    component: "DragSortNode",
    type: "clear",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
</script>

<template>
  <section
    :class="[
      'vp-drag-sort-node',
      { 'vp-drag-sort-node--disabled': disabled },
      props.class,
    ]"
    :style="style"
    :aria-label="ariaLabel ?? title ?? t('component.drag-sort-node.title')"
    :aria-busy="loading"
    data-component="DragSortNode"
  >
    <header class="vp-drag-sort-node__header">
      <h3 class="vp-drag-sort-node__title">
        {{ title ?? t("component.drag-sort-node.title") }}
      </h3>
      <slot name="actions" :nodes="list" :clear="clear">
        <button
          v-if="clearable"
          type="button"
          :disabled="disabled || loading || !list.length"
          @click="clear"
        >
          {{ t("button.reset") }}
        </button>
      </slot>
    </header>
    <div v-if="loading" class="vp-drag-sort-node__state" role="status">
      {{ t("common.loading") }}
    </div>
    <ul
      v-else-if="list.length"
      class="vp-drag-sort-node__list"
      role="listbox"
      :aria-disabled="disabled"
    >
      <li
        v-for="(node, index) in list"
        :key="node.id"
        :class="[
          'vp-drag-sort-node__item',
          {
            'vp-drag-sort-node__item--selected': selectedId === node.id,
            'vp-drag-sort-node__item--dragging': draggingId === node.id,
            'vp-drag-sort-node__item--locked': node.locked,
          },
        ]"
        :draggable="!disabled && !node.locked"
        role="option"
        :aria-selected="selectedId === node.id"
        :aria-disabled="disabled || node.locked"
        :tabindex="disabled || node.locked ? -1 : 0"
        @click="select(node)"
        @keydown="keydown($event, index)"
        @dragstart="dragStart(node, $event)"
        @dragover.prevent
        @drop="drop(index)"
        @dragend="dragEnd(node, $event)"
      >
        <slot
          name="item"
          :node="node"
          :index="index"
          :selected="selectedId === node.id"
        >
          <span class="vp-drag-sort-node__handle" aria-hidden="true">⋮⋮</span>
          <span class="vp-drag-sort-node__content"
            ><strong>{{ node.label }}</strong
            ><small>{{ node.type }}</small></span
          >
          <span class="vp-drag-sort-node__position"
            >{{ index + 1 }} / {{ list.length }}</span
          >
        </slot>
      </li>
    </ul>
    <div v-else class="vp-drag-sort-node__state" role="status">
      <slot name="empty">{{ emptyText ?? t("common.noData") }}</slot>
    </div>
  </section>
</template>
