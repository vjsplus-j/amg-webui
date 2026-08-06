<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import type {
  TableDragColumn,
  TableDragEmits,
  TableDragKey,
  TableDragProps,
  TableDragRow,
} from "./types";
import "./style.scss";

const props = withDefaults(defineProps<TableDragProps>(), {
  rows: () => [],
  columns: () => [],
  disabled: false,
  loading: false,
  striped: true,
  selectedKey: null,
  telemetry: undefined,
});
const emit = defineEmits<TableDragEmits>();
const { t } = useLocale();
const localRows = ref<TableDragRow[]>([]);
const dragIndex = ref<number | null>(null);
const overIndex = ref<number | null>(null);

const sourceRows = computed(
  () =>
    props.modelValue ?? (props.rows.length ? props.rows : (props.data ?? [])),
);
watch(
  sourceRows,
  (rows) => {
    localRows.value = [...rows];
  },
  { immediate: true, deep: true },
);

const visibleColumns = computed<TableDragColumn[]>(() => {
  if (props.columns.length) return props.columns;
  const first = localRows.value[0];
  return first
    ? Object.keys(first).map((field) => ({ field, header: field }))
    : [];
});
const titleText = computed(
  () => props.title ?? t("component.table-drag.title"),
);

function keyOf(row: TableDragRow, index: number): TableDragKey {
  if (typeof props.rowKey === "function") return props.rowKey(row, index);
  if (
    props.rowKey &&
    (typeof row[props.rowKey] === "string" ||
      typeof row[props.rowKey] === "number")
  ) {
    return row[props.rowKey] as TableDragKey;
  }
  const candidate = row.id ?? row.key;
  return typeof candidate === "string" || typeof candidate === "number"
    ? candidate
    : index;
}
function isLocked(index: number) {
  return (
    props.disabled ||
    Boolean(props.rowDisabled?.(localRows.value[index], index))
  );
}
function commit(from: number, to: number) {
  if (from === to || isLocked(from) || isLocked(to)) return;
  const rows = [...localRows.value];
  const [row] = rows.splice(from, 1);
  if (!row) return;
  rows.splice(to, 0, row);
  localRows.value = rows;
  emit("update:modelValue", rows);
  emit("change", rows);
  emit("reorder", rows, row, from, to);
  trackEmit({
    component: "TableDrag",
    type: "reorder",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { from, to, key: keyOf(row, to) },
  });
}
function onDragStart(index: number, event: DragEvent) {
  if (isLocked(index)) {
    event.preventDefault();
    return;
  }
  dragIndex.value = index;
  event.dataTransfer?.setData(
    "text/plain",
    String(keyOf(localRows.value[index], index)),
  );
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  emit("dragStart", localRows.value[index], index, event);
}
function onDragOver(index: number, event: DragEvent) {
  if (isLocked(index) || dragIndex.value == null) return;
  event.preventDefault();
  overIndex.value = index;
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
}
function onDrop(index: number, event: DragEvent) {
  event.preventDefault();
  if (dragIndex.value != null) commit(dragIndex.value, index);
  dragIndex.value = null;
  overIndex.value = null;
}
function onDragEnd(index: number, event: DragEvent) {
  const row = localRows.value[index];
  if (row) emit("dragEnd", row, index, event);
  dragIndex.value = null;
  overIndex.value = null;
}
function onHandleKeydown(index: number, event: KeyboardEvent) {
  const target =
    event.key === "ArrowUp"
      ? index - 1
      : event.key === "ArrowDown"
        ? index + 1
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? localRows.value.length - 1
            : index;
  if (target === index || target < 0 || target >= localRows.value.length)
    return;
  event.preventDefault();
  commit(index, target);
}
function selectRow(row: TableDragRow, index: number, event: MouseEvent) {
  if (props.disabled) return;
  emit("update:selectedKey", keyOf(row, index));
  emit("rowClick", row, index, event);
  emit("click", event);
  trackEmit({
    component: "TableDrag",
    type: "rowClick",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { key: keyOf(row, index), index },
  });
}
</script>

<template>
  <section
    :class="[
      'vp-table-drag',
      { 'vp-table-drag--disabled': disabled },
      props.class,
    ]"
    :style="style"
    :aria-label="ariaLabel ?? titleText"
    :aria-busy="loading"
    data-component="TableDrag"
  >
    <header
      v-if="titleText || description || $slots.header"
      class="vp-table-drag__header"
    >
      <slot name="header"
        ><h3>{{ titleText }}</h3>
        <p v-if="description">{{ description }}</p></slot
      >
    </header>
    <div v-if="loading" class="vp-table-drag__state" role="status">
      {{ t("common.loading") }}
    </div>
    <div v-else class="vp-table-drag__scroll">
      <table class="vp-table-drag__grid">
        <thead>
          <tr>
            <th class="vp-table-drag__handle-head" scope="col" />
            <th
              v-for="column in visibleColumns"
              :key="column.field"
              scope="col"
              :style="{ width: column.width, textAlign: column.align }"
            >
              {{ column.header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in localRows"
            :key="keyOf(row, index)"
            :class="{
              'vp-table-drag__row--over': overIndex === index,
              'vp-table-drag__row--selected': selectedKey === keyOf(row, index),
              'vp-table-drag__row--locked': isLocked(index),
            }"
            :aria-selected="selectedKey === keyOf(row, index)"
            @dragover="onDragOver(index, $event)"
            @drop="onDrop(index, $event)"
            @click="selectRow(row, index, $event)"
          >
            <td class="vp-table-drag__handle-cell">
              <button
                type="button"
                class="vp-table-drag__handle"
                :disabled="isLocked(index)"
                :draggable="!isLocked(index)"
                :aria-label="`${titleText} ${index + 1}`"
                @dragstart="onDragStart(index, $event)"
                @dragend="onDragEnd(index, $event)"
                @keydown="onHandleKeydown(index, $event)"
                @click.stop
              >
                ⋮⋮
              </button>
            </td>
            <td
              v-for="column in visibleColumns"
              :key="column.field"
              :style="{ textAlign: column.align }"
            >
              <slot
                :name="`cell-${column.field}`"
                :row="row"
                :column="column"
                :index="index"
                >{{ row[column.field] }}</slot
              >
            </td>
          </tr>
          <tr v-if="!localRows.length">
            <td
              :colspan="visibleColumns.length + 1"
              class="vp-table-drag__state"
            >
              <slot name="empty">{{ emptyText ?? t("common.noData") }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot name="footer" :rows="localRows" />
  </section>
</template>
