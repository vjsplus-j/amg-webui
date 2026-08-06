<script setup lang="ts">
import { computed, ref } from "vue";
import { useLocale } from "@amg-webui/hooks";
import type { TablePrintProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<TablePrintProps>(), {
  columns: () => [],
  data: () => [],
  disabled: false,
  bordered: true,
  showToolbar: true,
});

const emit = defineEmits<{
  (e: "print"): void;
  (e: "before-print"): void;
  (e: "after-print"): void;
  (e: "error", error: Error): void;
}>();
const { t } = useLocale();
const regionRef = ref<HTMLElement | null>(null);

const cols = computed<
  Array<{
    key: string;
    label?: string;
    formatter?: (
      value: unknown,
      row: Record<string, unknown>,
      index: number,
    ) => string;
  }>
>(() => {
  if (props.columns.length) return props.columns;
  const first = props.data[0];
  if (!first) return [];
  return Object.keys(first).map((key) => ({ key, label: key }));
});

function printTable() {
  if (props.disabled || !regionRef.value) return;
  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) {
    emit("error", new Error("print window blocked"));
    return;
  }
  emit("before-print");
  try {
    win.document.title = props.title ?? t("component.table-print.title");
    document
      .querySelectorAll('style, link[rel="stylesheet"]')
      .forEach((node) => win.document.head.appendChild(node.cloneNode(true)));
    win.document.body.appendChild(regionRef.value.cloneNode(true));
    const finish = () => {
      emit("after-print");
      win.close();
    };
    win.addEventListener("afterprint", finish, { once: true });
    win.focus();
    win.print();
    emit("print");
  } catch (error) {
    emit("error", error instanceof Error ? error : new Error(String(error)));
    win.close();
  }
}

function formatCell(row: Record<string, unknown>, key: string, index: number) {
  const col = cols.value.find((item) => item.key === key);
  return col?.formatter ? col.formatter(row[key], row, index) : row[key];
}
</script>

<template>
  <div
    :class="['vp-table-print', props.class]"
    :style="style"
    data-component="TablePrint"
  >
    <button
      v-if="showToolbar"
      type="button"
      class="vp-table-print__btn"
      :disabled="disabled"
      :aria-label="t('common.print')"
      @click="printTable"
    >
      {{ t("common.print") }}
    </button>
    <div ref="regionRef" class="vp-table-print__region">
      <table
        class="vp-table-print__table"
        :class="{ 'vp-table-print__table--bordered': bordered }"
        role="table"
        :aria-label="title ?? t('component.table-print.title')"
      >
        <thead>
          <tr>
            <th v-for="col in cols" :key="col.key" scope="col">
              {{ col.label ?? col.key }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in data" :key="i">
            <td v-for="col in cols" :key="col.key">
              <slot
                name="cell"
                :column="col"
                :row="row"
                :index="i"
                :value="row[col.key]"
                >{{ formatCell(row, col.key, i) }}</slot
              >
            </td>
          </tr>
          <tr v-if="!data.length">
            <td
              :colspan="Math.max(1, cols.length)"
              class="vp-table-print__empty"
            >
              <slot name="empty">{{ emptyText ?? t("common.noData") }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
      <slot />
    </div>
  </div>
</template>
