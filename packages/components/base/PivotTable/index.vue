<script setup lang="ts">
import { computed } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import type {
  PivotCell,
  PivotRecord,
  PivotTableEmits,
  PivotTableProps,
} from "./types";
import "./style.scss";

const props = withDefaults(defineProps<PivotTableProps>(), {
  rows: () => [],
  data: () => [],
  aggregator: "sum",
  modelValue: null,
  showRowTotals: true,
  showColumnTotals: true,
  stickyHeader: true,
  loading: false,
  disabled: false,
  telemetry: undefined,
});
const emit = defineEmits<PivotTableEmits>();
const { t } = useLocale();
const source = computed(() => (props.rows.length ? props.rows : props.data));
const rowField = computed(() => props.rowField ?? "");
const columnField = computed(() => props.columnField ?? props.colField ?? "");
const rowKeys = computed(() =>
  rowField.value
    ? [
        ...new Set(
          source.value.map((row) => String(row[rowField.value] ?? "—")),
        ),
      ]
    : [],
);
const columnKeys = computed(() =>
  columnField.value
    ? [
        ...new Set(
          source.value.map((row) => String(row[columnField.value] ?? "—")),
        ),
      ]
    : [""],
);

function aggregate(records: PivotRecord[]) {
  if (typeof props.aggregator === "function")
    return props.aggregator(records, props.valueField);
  if (props.aggregator === "count") return records.length;
  const values = records
    .map((record) =>
      Number(props.valueField ? record[props.valueField] : undefined),
    )
    .filter(Number.isFinite);
  if (!values.length) return 0;
  if (props.aggregator === "average")
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  if (props.aggregator === "min") return Math.min(...values);
  if (props.aggregator === "max") return Math.max(...values);
  return values.reduce((sum, value) => sum + value, 0);
}
function recordsFor(rowKey?: string, colKey?: string) {
  return source.value.filter(
    (row) =>
      (rowKey == null || String(row[rowField.value] ?? "—") === rowKey) &&
      (colKey == null ||
        !columnField.value ||
        String(row[columnField.value] ?? "—") === colKey),
  );
}
function cell(rowKey: string, columnKey: string): PivotCell {
  const records = recordsFor(rowKey, columnKey);
  return { rowKey, columnKey, records, value: aggregate(records) };
}
function format(value: number, target?: PivotCell) {
  return props.valueFormatter
    ? props.valueFormatter(value, target)
    : new Intl.NumberFormat().format(value);
}
function selectRow(rowKey: string, event: MouseEvent) {
  if (props.disabled || props.loading) return;
  const next = props.modelValue === rowKey ? null : rowKey;
  emit("update:modelValue", next);
  emit("change", next);
  emit("rowClick", rowKey, event);
  trackEmit({
    component: "PivotTable",
    type: "rowClick",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { rowKey },
  });
}
function clickCell(target: PivotCell, event: MouseEvent) {
  if (props.disabled || props.loading) return;
  event.stopPropagation();
  emit("cellClick", target, event);
  trackEmit({
    component: "PivotTable",
    type: "cellClick",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: {
      rowKey: target.rowKey,
      columnKey: target.columnKey,
      value: target.value,
    },
  });
}
</script>

<template>
  <section
    :class="[
      'vp-pivot-table',
      { 'vp-pivot-table--disabled': disabled },
      props.class,
    ]"
    :style="style"
    :aria-busy="loading"
    data-component="PivotTable"
  >
    <header
      v-if="title || description || $slots.header"
      class="vp-pivot-table__header"
    >
      <slot name="header"
        ><div>
          <h3 v-if="title" class="vp-pivot-table__title">{{ title }}</h3>
          <p v-if="description" class="vp-pivot-table__description">
            {{ description }}
          </p>
        </div></slot
      >
    </header>
    <div v-if="loading" class="vp-pivot-table__loading" role="status">
      {{ t("common.loading") }}
    </div>
    <div v-else class="vp-pivot-table__scroll">
      <table class="vp-pivot-table__grid">
        <thead :class="{ 'vp-pivot-table__thead--sticky': stickyHeader }">
          <tr>
            <th scope="col">{{ rowLabel ?? rowField }}</th>
            <th v-for="key in columnKeys" :key="key" scope="col">{{ key }}</th>
            <th v-if="showRowTotals" scope="col">{{ t("common.total") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="rowKey in rowKeys"
            :key="rowKey"
            :class="{ 'vp-pivot-table__row--selected': modelValue === rowKey }"
            :tabindex="disabled ? undefined : 0"
            :aria-selected="modelValue === rowKey"
            @click="selectRow(rowKey, $event)"
            @keydown.enter.prevent="
              selectRow(rowKey, $event as unknown as MouseEvent)
            "
          >
            <th scope="row">
              <slot name="row" :row-key="rowKey">{{ rowKey }}</slot>
            </th>
            <td
              v-for="columnKey in columnKeys"
              :key="columnKey"
              @click="clickCell(cell(rowKey, columnKey), $event)"
            >
              <slot name="cell" :cell="cell(rowKey, columnKey)">{{
                format(cell(rowKey, columnKey).value, cell(rowKey, columnKey))
              }}</slot>
            </td>
            <td v-if="showRowTotals" class="vp-pivot-table__total">
              {{ format(aggregate(recordsFor(rowKey))) }}
            </td>
          </tr>
          <tr
            v-if="showColumnTotals && rowKeys.length"
            class="vp-pivot-table__totals"
          >
            <th scope="row">{{ t("common.total") }}</th>
            <td v-for="columnKey in columnKeys" :key="columnKey">
              {{ format(aggregate(recordsFor(undefined, columnKey))) }}
            </td>
            <td v-if="showRowTotals">{{ format(aggregate(source)) }}</td>
          </tr>
          <tr v-if="!rowKeys.length">
            <td
              :colspan="columnKeys.length + (showRowTotals ? 2 : 1)"
              class="vp-pivot-table__empty"
            >
              <slot name="empty">{{ t("common.noData") }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
