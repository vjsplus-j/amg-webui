<script setup lang="ts">
import { computed } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import { useTableState } from "@amg-webui/utils/data-display/useTableState";
import type {
  MergeTableColumn,
  MergeTableEmits,
  MergeTableProps,
  MergeTableRow,
} from "./types";
import "./style.scss";

const props = withDefaults(defineProps<MergeTableProps>(), {
  data: () => [],
  rows: () => [],
  columns: () => [],
  mergeField: "",
  mergeFields: () => [],
  modelValue: null,
  disabled: false,
  loading: false,
  bordered: true,
  striped: false,
  stickyHeader: false,
  telemetry: undefined,
});
const emit = defineEmits<MergeTableEmits>();
const { t } = useLocale();
const sourceRows = computed(() =>
  props.rows.length ? props.rows : props.data,
);
const sourceColumns = computed<MergeTableColumn[]>(() => {
  if (props.columns.length) return props.columns;
  const first = sourceRows.value[0];
  return first
    ? Object.keys(first).map((field) => ({ field, header: field }))
    : [];
});
const tableColumns = computed(() =>
  sourceColumns.value.map((column) => ({
    field: column.field,
    header: column.header,
    sortable: column.sortable,
    width: column.width,
  })),
);
const { visibleColumns, filteredRows, sortField, sortDir, toggleSort } =
  useTableState(sourceRows, tableColumns);
const columns = computed(() =>
  visibleColumns.value.map(
    (column) =>
      sourceColumns.value.find((item) => item.field === column.field) ?? column,
  ),
);
const mergeKeys = computed(() => {
  const requested = props.mergeFields.length
    ? props.mergeFields
    : props.mergeField
      ? [props.mergeField]
      : columns.value[0]
        ? [columns.value[0].field]
        : [];
  return requested.filter((field) =>
    columns.value.some((column) => column.field === field),
  );
});

function sameGroup(
  a: MergeTableRow | undefined,
  b: MergeTableRow | undefined,
  field: string,
) {
  if (!a || !b) return false;
  const level = mergeKeys.value.indexOf(field);
  if (level < 0) return false;
  return mergeKeys.value.slice(0, level + 1).every((key) => a[key] === b[key]);
}
function rowspan(field: string, rowIndex: number) {
  if (!mergeKeys.value.includes(field)) return 1;
  const rows = filteredRows.value;
  if (sameGroup(rows[rowIndex - 1], rows[rowIndex], field)) return 0;
  let span = 1;
  while (sameGroup(rows[rowIndex], rows[rowIndex + span], field)) span++;
  return span;
}
function keyOf(row: MergeTableRow, index: number) {
  if (typeof props.rowKey === "function") return props.rowKey(row, index);
  if (props.rowKey) return row[props.rowKey] as string | number;
  return index;
}
function selected(row: MergeTableRow, index: number) {
  return props.modelValue === row || props.modelValue === keyOf(row, index);
}
function activate(
  row: MergeTableRow,
  index: number,
  event: MouseEvent | KeyboardEvent,
) {
  if (props.disabled) return;
  if (event instanceof KeyboardEvent) event.preventDefault();
  const value = props.rowKey ? keyOf(row, index) : row;
  emit("update:modelValue", value);
  emit("change", row, index);
  emit("rowClick", row, index, event);
  trackEmit({
    component: "MergeTable",
    type: "rowClick",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { rowKey: keyOf(row, index) },
  });
}
function sort(column: MergeTableColumn) {
  if (!column.sortable || props.disabled) return;
  toggleSort(column.field);
  emit("sortChange", sortField.value, sortDir.value);
}
function display(column: MergeTableColumn, row: MergeTableRow, index: number) {
  const value = row[column.field];
  return column.formatter ? column.formatter(value, row, index) : value;
}
</script>

<template>
  <section
    :class="[
      'vp-merge-table',
      {
        'vp-merge-table--bordered': bordered,
        'vp-merge-table--striped': striped,
        'vp-merge-table--sticky': stickyHeader,
        'vp-merge-table--disabled': disabled,
      },
      props.class,
    ]"
    :style="style"
    :aria-label="ariaLabel ?? title ?? t('component.merge-table.title')"
    :aria-busy="loading"
    data-component="MergeTable"
  >
    <header
      v-if="title || description || $slots.header"
      class="vp-merge-table__header"
    >
      <slot name="header">
        <h3 v-if="title" class="vp-merge-table__title">{{ title }}</h3>
        <p v-if="description" class="vp-merge-table__description">
          {{ description }}
        </p>
      </slot>
    </header>
    <div class="vp-merge-table__scroll">
      <table class="vp-merge-table__grid">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.field"
              scope="col"
              :style="{ width: column.width, textAlign: column.align }"
              :aria-sort="
                sortField === column.field
                  ? sortDir === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              "
            >
              <button
                v-if="column.sortable"
                type="button"
                :disabled="disabled"
                @click="sort(column)"
              >
                {{ column.header
                }}<span aria-hidden="true">{{
                  sortField === column.field
                    ? sortDir === "asc"
                      ? "↑"
                      : "↓"
                    : "↕"
                }}</span>
              </button>
              <span v-else>{{ column.header }}</span>
            </th>
          </tr>
        </thead>
        <tbody v-if="!loading && filteredRows.length">
          <tr
            v-for="(row, rowIndex) in filteredRows"
            :key="keyOf(row, rowIndex)"
            :class="{
              'vp-merge-table__row--selected': selected(row, rowIndex),
            }"
            :tabindex="disabled ? undefined : 0"
            :aria-selected="selected(row, rowIndex)"
            @click="activate(row, rowIndex, $event)"
            @keydown.enter="activate(row, rowIndex, $event)"
            @keydown.space="activate(row, rowIndex, $event)"
          >
            <template v-for="column in columns" :key="column.field">
              <td
                v-if="rowspan(column.field, rowIndex) > 0"
                :rowspan="rowspan(column.field, rowIndex)"
                :style="{ textAlign: column.align }"
              >
                <slot
                  :name="`cell-${column.field}`"
                  :value="row[column.field]"
                  :row="row"
                  :row-index="rowIndex"
                  >{{ display(column, row, rowIndex) }}</slot
                >
              </td>
            </template>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td
              :colspan="Math.max(columns.length, 1)"
              class="vp-merge-table__state"
              role="status"
            >
              <slot v-if="loading" name="loading">{{
                t("common.loading")
              }}</slot>
              <slot v-else name="empty">{{
                emptyText ?? t("common.noData")
              }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot name="footer" :rows="filteredRows" />
  </section>
</template>
