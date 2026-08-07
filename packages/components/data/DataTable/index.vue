<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type CSSProperties,
} from "vue";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { useVirtualList } from "@amg-webui/utils/data-display/useVirtualList";
import { useVirtualColumns } from "@amg-webui/utils/data-display/useVirtualColumns";
import {
  parseWidthToPx,
  readCssPx,
} from "@amg-webui/utils/data-display/cssMeasure";
import {
  SORT_WORKER_THRESHOLD,
  disposeSortWorker,
  sortRowsAsync,
  sortRowsSync,
} from "@amg-webui/utils/data-display/sortRows";
import { trackEmit } from "@amg-webui/telemetry";
import type {
  Column,
  RowKey,
  SortOrder,
  DataTableRowInteractionEvent,
} from "./types";
import "./style.scss";

/**
 * Inline props — SFC does not expand imported generics reliably for runtime.
 */
const props = withDefaults(
  defineProps<{
    value?: any[];
    columns?: Column[];
    rowKey?: string;
    selection?: RowKey[];
    selectionMode?: "single" | "multiple";
    paginator?: boolean;
    rows?: number;
    first?: number;
    totalRecords?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    striped?: boolean;
    fixedHeader?: boolean;
    filterGlobal?: boolean;
    loading?: boolean;
    lazy?: boolean;
    filterDebounce?: number;
    /** Default ON — set false only when full DOM is required */
    virtual?: boolean;
    /** Viewport height as spacing-xs multiples — drives CSS + virtual fallback */
    virtualHeight?: number;
    /** Optional fixed row height (px); otherwise token + ResizeObserver */
    rowHeight?: number;
    /** Horizontal column windowing (default: auto by column count) */
    virtualColumns?: boolean;
    virtualColumnThreshold?: number;
    sortWorkerThreshold?: number;
    trackId?: string;
    telemetry?: boolean;
    class?: string;
    style?: Record<string, string>;
  }>(),
  {
    value: () => [],
    columns: () => [],
    rowKey: "id",
    selection: () => [],
    rows: 10,
    first: 0,
    totalRecords: 0,
    striped: false,
    fixedHeader: true,
    filterGlobal: false,
    virtual: true,
    virtualHeight: 80,
    virtualColumnThreshold: 8,
    sortWorkerThreshold: SORT_WORKER_THRESHOLD,
    lazy: false,
    filterDebounce: 200,
    telemetry: undefined,
  },
);

const emit = defineEmits<{
  "update:value": [value: any[]];
  "update:selection": [keys: RowKey[]];
  "update:sortField": [field: string];
  "update:sortOrder": [order: SortOrder];
  "update:first": [first: number];
  "update:rows": [rows: number];
  sort: [event: { field: string; order: SortOrder }];
  "row-select": [
    event: {
      originalEvent: DataTableRowInteractionEvent;
      data: any;
      checked: boolean;
    },
  ];
  "row-click": [
    event: { originalEvent: DataTableRowInteractionEvent; data: any },
  ];
  page: [
    event: { first: number; rows: number; page: number; pageCount: number },
  ];
  filter: [event: { global: string; fields: Record<string, string> }];
}>();

const { t } = useLocale();

const rootRef = ref<HTMLElement | null>(null);
const scrollRef = ref<HTMLElement | null>(null);
const bodyRef = ref<HTMLElement | null>(null);
const rowMeasureRef = ref<HTMLElement | null>(null);

const localValue = ref<any[]>([]);
const selectedKeys = ref<Set<RowKey>>(new Set());
const globalFilterInput = ref("");
const globalFilter = ref("");
const columnFilterInputs = ref<Record<string, string>>({});
const columnFilters = ref<Record<string, string>>({});
const innerSortField = ref<string | undefined>();
const innerSortOrder = ref<SortOrder>(null);
const sortedRows = ref<any[] | null>(null);
const sortBusy = ref(false);

const spacingXsPx = ref(4);
const estimatedRowHeightPx = ref(44);
const defaultColWidthPx = ref(160);
const measuredColWidths = ref<Record<string, number>>({});

function refreshTokenMetrics() {
  const el = rootRef.value;
  spacingXsPx.value = readCssPx(el, "--spacing-xs", 4);
  estimatedRowHeightPx.value = readCssPx(el, "--theme-table-row-height", 44);
  defaultColWidthPx.value = readCssPx(el, "--theme-table-col-min-width", 160);
}

onMounted(() => {
  refreshTokenMetrics();
  void nextTick(measureHeaderColumns);
});

watch(
  () => props.value,
  (val) => {
    localValue.value = Array.isArray(val) ? [...val] : [];
  },
  { immediate: true },
);

watch(
  () => props.selection,
  (val) => {
    selectedKeys.value = new Set(Array.isArray(val) ? val : []);
  },
  { immediate: true },
);

let filterTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  [globalFilterInput, columnFilterInputs],
  () => {
    if (filterTimer) clearTimeout(filterTimer);
    filterTimer = setTimeout(
      () => {
        globalFilter.value = globalFilterInput.value;
        columnFilters.value = { ...columnFilterInputs.value };
        const payload = {
          global: globalFilter.value,
          fields: { ...columnFilters.value },
        };
        emit("filter", payload);
        trackEmit({
          component: "DataTable",
          type: "filter",
          trackId: props.trackId,
          telemetry: props.telemetry,
          payload,
        });
      },
      Math.max(0, props.filterDebounce),
    );
  },
  { deep: true },
);

onUnmounted(() => {
  if (filterTimer) clearTimeout(filterTimer);
  disposeSortWorker();
});

function needsStableRowKeysNow() {
  return Boolean(props.selectionMode) || props.virtual !== false;
}

function readRowFieldKey(row: any): RowKey | null {
  const fieldKey = row?.[props.rowKey];
  if (fieldKey === undefined || fieldKey === null || fieldKey === "") return null;
  return fieldKey as RowKey;
}

function resolveRowKey(row: any, index: number): RowKey | null {
  const fieldKey = readRowFieldKey(row);
  if (fieldKey !== null) return fieldKey;
  if (needsStableRowKeysNow()) return null;
  return index;
}

function resolveDomRowKey(row: any, index: number): RowKey {
  return resolveRowKey(row, index) ?? `__amg-unstable-row-${index}`;
}

const rowKeyIssueWarned = ref(false);

function warnRowKeyIssues(source: any[]) {
  if (!import.meta.env.DEV || rowKeyIssueWarned.value) return;
  if (!needsStableRowKeysNow() || !source.length) return;

  const seen = new Map<RowKey, number>();
  let missingField = 0;

  for (let i = 0; i < source.length; i += 1) {
    const row = source[i];
    const fieldKey = readRowFieldKey(row);
    if (fieldKey === null) {
      missingField += 1;
      continue;
    }
    seen.set(fieldKey, (seen.get(fieldKey) ?? 0) + 1);
  }

  const duplicates = [...seen.entries()].filter(([, count]) => count > 1);
  if (!missingField && !duplicates.length) return;

  rowKeyIssueWarned.value = true;
  if (missingField) {
    console.error(
      `[DataTable] ${missingField} row(s) missing unique "${props.rowKey}" values while selection or virtual scroll is enabled. Provide stable rowKey values — index fallback is disabled for identity-sensitive paths.`,
    );
  }
  if (duplicates.length) {
    console.error(
      "[DataTable] Duplicate row keys detected:",
      duplicates.map(([key]) => key),
    );
  }
}

function emitSelection() {
  emit("update:selection", Array.from(selectedKeys.value));
}

watch(
  () => [props.sortField, props.sortOrder] as const,
  ([field, order]) => {
    if (field !== undefined) innerSortField.value = field;
    if (order !== undefined) innerSortOrder.value = order;
  },
  { immediate: true },
);

const cols = computed(() => props.columns ?? []);

const hasColumnFilters = computed(() =>
  cols.value.some((column) => column.filter),
);

const filteredOnly = computed(() => {
  let list = localValue.value ?? [];
  if (props.lazy) return list;
  if (globalFilter.value) {
    const filter = globalFilter.value.toLowerCase();
    list = list.filter((row) =>
      Object.values(row ?? {}).some((val) =>
        String(val).toLowerCase().includes(filter),
      ),
    );
  }
  for (const column of cols.value) {
    if (!column.filter) continue;
    const filterText = (columnFilters.value[column.field] ?? "")
      .trim()
      .toLowerCase();
    if (!filterText) continue;
    list = list.filter((row) =>
      String(row?.[column.field] ?? "")
        .toLowerCase()
        .includes(filterText),
    );
  }
  return list;
});

watch(
  [filteredOnly, innerSortField, innerSortOrder],
  async ([list, field, order], _prev, onCleanup) => {
    let cancelled = false;
    onCleanup(() => {
      cancelled = true;
    });
    if (props.lazy || !field || !order) {
      sortedRows.value = null;
      sortBusy.value = false;
      return;
    }
    const threshold = props.sortWorkerThreshold ?? SORT_WORKER_THRESHOLD;
    if (list.length < threshold) {
      sortedRows.value = sortRowsSync(list, field, order);
      sortBusy.value = false;
      return;
    }
    sortBusy.value = true;
    try {
      const next = await sortRowsAsync(list, field, order, threshold);
      if (!cancelled) sortedRows.value = next;
    } catch {
      if (!cancelled) sortedRows.value = sortRowsSync(list, field, order);
    } finally {
      if (!cancelled) sortBusy.value = false;
    }
  },
  { immediate: true },
);

const filteredData = computed(() => {
  if (props.lazy) return localValue.value ?? [];
  const field = innerSortField.value;
  const order = innerSortOrder.value;
  if (field && order) return sortedRows.value ?? filteredOnly.value;
  return filteredOnly.value;
});

/** Virtual applies to the current display set (full list or current page). */
const useVirtual = computed(() => props.virtual !== false);

watch(
  [filteredData, () => props.selectionMode, useVirtual, () => props.rowKey],
  ([list]) => {
    rowKeyIssueWarned.value = false;
    warnRowKeyIssues(Array.isArray(list) ? list : []);
  },
  { immediate: true },
);

const displaySource = computed(() => {
  const list = filteredData.value;
  if (props.paginator) {
    if (props.lazy) return list;
    return list.slice(props.first, props.first + props.rows);
  }
  return list;
});

const containerHeightPx = computed(
  () => Math.max(1, props.virtualHeight) * spacingXsPx.value,
);

const estimatedItemHeightPx = computed(
  () => props.rowHeight ?? estimatedRowHeightPx.value,
);

const rowRef = computed(() => displaySource.value);
const {
  visibleItems,
  totalHeight,
  offsetY,
  itemHeight,
  onScroll,
  reset: resetVirtual,
  scrollToIndex,
} = useVirtualList(rowRef, {
  containerHeight: containerHeightPx,
  itemHeight: estimatedItemHeightPx,
  containerRef: bodyRef,
  itemMeasureRef: rowMeasureRef,
});

watch([globalFilter, columnFilters], resetVirtual, { deep: true });

const displayRows = computed(() => {
  if (useVirtual.value) {
    return visibleItems.value.map(({ item, index }) => ({ row: item, index }));
  }
  return displaySource.value.map((row, index) => ({ row, index }));
});

watch(
  displayRows,
  async (visible) => {
    await nextTick();
    const first = visible[0];
    if (!first || !bodyRef.value) {
      rowMeasureRef.value = null;
      return;
    }
    const key = String(resolveDomRowKey(first.row, first.index));
    const nodes = bodyRef.value.querySelectorAll<HTMLElement>("tr[data-row-key]");
    rowMeasureRef.value =
      Array.from(nodes).find((node) => node.dataset.rowKey === key) ?? null;
  },
  { flush: "post" },
);

const columnSpecs = computed(() =>
  cols.value.map((column) => ({
    key: column.field,
    width:
      measuredColWidths.value[column.field] ??
      parseWidthToPx(column.width, defaultColWidthPx.value),
    fixed: column.fixed,
  })),
);

const hVirtualEnabled = computed(() => {
  if (props.virtualColumns === false) return false;
  if (props.virtualColumns === true) return true;
  return columnSpecs.value.length >= (props.virtualColumnThreshold ?? 8);
});

const {
  fixedLeft,
  fixedRight,
  visibleScrollable,
  offsetX,
  trailingWidth,
  onScroll: onHorizontalScroll,
  reset: resetHorizontal,
} = useVirtualColumns(columnSpecs, {
  containerRef: scrollRef,
  enabled: hVirtualEnabled,
});

const visibleColumns = computed(() => {
  if (!hVirtualEnabled.value) return cols.value;
  const byField = new Map(cols.value.map((column) => [column.field, column]));
  const pick = (key: string) => byField.get(key);
  return [
    ...fixedLeft.value.map((spec) => pick(spec.key)).filter(Boolean),
    ...visibleScrollable.value
      .map(({ column }) => pick(column.key))
      .filter(Boolean),
    ...fixedRight.value.map((spec) => pick(spec.key)).filter(Boolean),
  ] as Column[];
});

const fixedLeftOffsets = computed(() => {
  const map = new Map<string, number>();
  let acc = props.selectionMode ? defaultColWidthPx.value * 0.75 : 0;
  // selection col uses token width in CSS; approximate via spacing
  if (props.selectionMode) {
    acc = readCssPx(rootRef.value, "--spacing-md", 12) * 3;
  } else {
    acc = 0;
  }
  for (const spec of fixedLeft.value) {
    map.set(spec.key, acc);
    acc += spec.width;
  }
  return map;
});

const fixedRightOffsets = computed(() => {
  const map = new Map<string, number>();
  let acc = 0;
  for (let i = fixedRight.value.length - 1; i >= 0; i -= 1) {
    const spec = fixedRight.value[i]!;
    map.set(spec.key, acc);
    acc += spec.width;
  }
  return map;
});

function columnWidthPx(field: string): number {
  return (
    measuredColWidths.value[field] ??
    parseWidthToPx(
      cols.value.find((column) => column.field === field)?.width,
      defaultColWidthPx.value,
    )
  );
}

function measureHeaderColumns() {
  const root = rootRef.value;
  if (!root) return;
  const cells = root.querySelectorAll<HTMLElement>(
    ".vp-datatable__table--head th[data-field]",
  );
  if (!cells.length) return;
  const next: Record<string, number> = { ...measuredColWidths.value };
  let changed = false;
  for (const cell of cells) {
    const field = cell.dataset.field;
    if (!field) continue;
    const declared = cols.value.find((column) => column.field === field)?.width;
    if (declared) {
      const px = parseWidthToPx(declared, defaultColWidthPx.value);
      if (next[field] !== px) {
        next[field] = px;
        changed = true;
      }
      continue;
    }
    const width = Math.round(cell.getBoundingClientRect().width);
    if (width > 0 && next[field] !== width) {
      next[field] = width;
      changed = true;
    }
  }
  if (changed) measuredColWidths.value = next;
}

watch(
  () => cols.value.map((column) => `${column.field}:${column.width ?? ""}`).join("|"),
  async () => {
    await nextTick();
    measureHeaderColumns();
  },
);

const pageCount = computed(() =>
  Math.max(
    1,
    Math.ceil(
      (props.totalRecords || filteredData.value.length || 1) / props.rows,
    ),
  ),
);

const currentPage = computed(() => Math.floor(props.first / props.rows) + 1);

const metaText = computed(() => {
  const total = props.lazy
    ? (props.totalRecords ?? filteredData.value.length)
    : filteredData.value.length;
  if (!total) return t(LocaleKeys.common.noData);
  if (props.paginator) {
    const from = total === 0 ? 0 : props.first + 1;
    const to = Math.min(props.first + props.rows, total);
    return t("component.datatable.showing", { from, to, total });
  }
  return t("component.datatable.rowCount", { total });
});

/** Fixed viewport so both virtual and paginated tables can scroll inside. */
const bodyStyle = computed(() => ({
  height: `calc(var(--spacing-xs) * ${props.virtualHeight})`,
  maxHeight: `calc(var(--spacing-xs) * ${props.virtualHeight})`,
}));

const colCount = computed(
  () =>
    (hVirtualEnabled.value ? visibleColumns.value.length : cols.value.length) +
    (props.selectionMode ? 1 : 0) +
    (hVirtualEnabled.value ? 2 : 0),
);

function cellStyle(column: Column): CSSProperties {
  const style: CSSProperties = { ...(column.style ?? {}) };
  const width = columnWidthPx(column.field);
  style.width = `${width}px`;
  style.minWidth = `${width}px`;
  style.maxWidth = `${width}px`;
  if (column.fixed === "left") {
    style.position = "sticky";
    style.left = `${fixedLeftOffsets.value.get(column.field) ?? 0}px`;
    style.zIndex = 2;
  } else if (column.fixed === "right") {
    style.position = "sticky";
    style.right = `${fixedRightOffsets.value.get(column.field) ?? 0}px`;
    style.zIndex = 2;
  }
  return style;
}

function handleSort(column: Column) {
  if (!column.sortable) return;
  let next: SortOrder = "asc";
  if (innerSortField.value === column.field) {
    next = innerSortOrder.value === "asc" ? "desc" : "asc";
  }
  innerSortField.value = column.field;
  innerSortOrder.value = next;
  resetVirtual();
  trackEmit({
    component: "DataTable",
    type: "sort",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { field: column.field, order: next },
  });
  emit("update:sortField", column.field);
  emit("update:sortOrder", next);
  emit("sort", { field: column.field, order: next });
}

function handleRowClick(row: any, index: number, event: MouseEvent) {
  emit("row-click", { originalEvent: event, data: row });
  if (props.selectionMode) toggleRowSelection(row, index, event);
}

function toggleRowSelection(
  row: any,
  index: number,
  event: DataTableRowInteractionEvent,
) {
  if (!props.selectionMode) return;
  const key = resolveRowKey(row, index);
  if (key === null) return;
  const checked = !selectedKeys.value.has(key);
  if (checked) {
    if (props.selectionMode === "single") selectedKeys.value.clear();
    selectedKeys.value.add(key);
  } else {
    selectedKeys.value.delete(key);
  }
  trackEmit({
    component: "DataTable",
    type: "row-select",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { id: key, checked },
  });
  emitSelection();
  emit("row-select", { originalEvent: event, data: row, checked });
}

function toggleSelectAll(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  filteredData.value.forEach((row, index) => {
    const key = resolveRowKey(row, index);
    if (key === null) return;
    if (checked) selectedKeys.value.add(key);
    else selectedKeys.value.delete(key);
  });
  emitSelection();
}

const isAllSelected = computed(
  () =>
    filteredData.value.length > 0 &&
    filteredData.value.every((row, index) => {
      const key = resolveRowKey(row, index);
      return key !== null && selectedKeys.value.has(key);
    }),
);

function handlePageChange(page: number) {
  const first = (page - 1) * props.rows;
  resetVirtual();
  emit("update:first", first);
  emit("page", { first, rows: props.rows, page, pageCount: pageCount.value });
}

function handleRowsChange(event: Event) {
  const rows = Number((event.target as HTMLSelectElement).value);
  resetVirtual();
  emit("update:rows", rows);
  emit("update:first", 0);
  emit("page", {
    first: 0,
    rows,
    page: 1,
    pageCount: Math.ceil(
      (props.totalRecords || filteredData.value.length) / rows,
    ),
  });
}

function renderCell(column: Column, row: any) {
  if (column.render) return column.render(row[column.field], row);
  return row[column.field];
}

function sortState(column: Column) {
  if (!column.sortable || innerSortField.value !== column.field) return null;
  return innerSortOrder.value;
}

function onBodyScroll(event: Event) {
  if (useVirtual.value) onScroll(event);
}

function onScrollHost(event: Event) {
  if (hVirtualEnabled.value) onHorizontalScroll(event);
}

watch(hVirtualEnabled, (enabled) => {
  if (!enabled) resetHorizontal();
});

const focusedRowIndex = ref(-1)

function scrollTo(options: { rowIndex?: number; key?: RowKey } = {}) {
  const source = displaySource.value
  let index =
    typeof options.rowIndex === 'number' ? options.rowIndex : -1
  if (index < 0 && options.key !== undefined && options.key !== null) {
    index = source.findIndex(
      (row: any, i: number) => resolveRowKey(row, i) === options.key,
    )
  }
  if (index < 0 || index >= source.length) return
  focusedRowIndex.value = index
  if (useVirtual.value && typeof scrollToIndex === 'function') {
    scrollToIndex(index)
  } else if (scrollRef.value || bodyRef.value) {
    const host = bodyRef.value || scrollRef.value
    const rowEl = host?.querySelector(
      `[data-row-key="${String(resolveDomRowKey(source[index], index)).replace(/"/g, '\\"')}"]`,
    ) as HTMLElement | null
    rowEl?.scrollIntoView({ block: 'nearest' })
  }
}

function onSortKeydown(event: KeyboardEvent, column: Column) {
  if (!column.sortable) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleSort(column)
  }
}

function onTableKeydown(event: KeyboardEvent) {
  const source = displaySource.value
  if (!source.length) return
  const key = event.key
  if (
    !['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'Escape'].includes(
      key,
    )
  ) {
    return
  }
  const target = event.target as HTMLElement | null
  if (
    target &&
    (target.tagName === 'INPUT' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable)
  ) {
    if (key === 'Escape') (target as HTMLInputElement).blur()
    return
  }
  event.preventDefault()
  if (key === 'Home') {
    focusedRowIndex.value = 0
    scrollTo({ rowIndex: 0 })
    return
  }
  if (key === 'End') {
    focusedRowIndex.value = source.length - 1
    scrollTo({ rowIndex: source.length - 1 })
    return
  }
  if (key === 'ArrowDown') {
    focusedRowIndex.value = Math.min(
      source.length - 1,
      Math.max(0, focusedRowIndex.value) + 1,
    )
    scrollTo({ rowIndex: focusedRowIndex.value })
    return
  }
  if (key === 'ArrowUp') {
    focusedRowIndex.value = Math.max(0, focusedRowIndex.value - 1)
    scrollTo({ rowIndex: focusedRowIndex.value })
    return
  }
  if (key === 'Enter' || key === ' ') {
    const idx = focusedRowIndex.value
    if (idx < 0 || idx >= source.length) return
    const row = source[idx]
    if (props.selectionMode) {
      toggleRowSelection(row, idx, event);
    }
  }
  if (key === 'Escape') {
    focusedRowIndex.value = -1
  }
}

defineExpose({
  scrollTo,
})
</script>

<template>
  <div
    ref="rootRef"
    :class="[
      'vp-datatable',
      {
        'vp-datatable--fixed-header': fixedHeader,
        'vp-datatable--h-virtual': hVirtualEnabled,
        'vp-datatable--sort-busy': sortBusy,
      },
      props.class,
    ]"
    :style="style"
    role="region"
    :aria-label="t(LocaleKeys.component.dataTable.title)"
    tabindex="0"
    @keydown="onTableKeydown"
  >
    <div
      v-if="loading || sortBusy"
      class="vp-datatable__loading"
      :aria-label="t(LocaleKeys.common.loading)"
    >
      <slot name="loading">
        <span class="vp-datatable__spinner" aria-hidden="true" />
      </slot>
    </div>

    <div v-if="$slots.header || filterGlobal" class="vp-datatable__header">
      <div class="vp-datatable__header-left">
        <slot name="header" />
      </div>
      <div v-if="filterGlobal" class="vp-datatable__header-right">
        <label class="vp-datatable__filter">
          <span class="vp-datatable__sr">{{
            t(LocaleKeys.common.search)
          }}</span>
          <input
            v-model="globalFilterInput"
            type="search"
            :placeholder="t(LocaleKeys.common.search)"
          />
        </label>
      </div>
    </div>

    <div ref="scrollRef" class="vp-datatable__scroll" @scroll="onScrollHost">
      <!-- Sticky header table (outside scroll body) -->
      <table
        v-if="fixedHeader"
        class="vp-datatable__table vp-datatable__table--head"
      >
        <colgroup>
          <col v-if="selectionMode" class="vp-datatable__col--check" />
          <col
            v-if="hVirtualEnabled"
            :style="{ width: `${offsetX}px` }"
          />
          <col
            v-for="column in visibleColumns"
            :key="column.field"
            :style="{ width: `${columnWidthPx(column.field)}px` }"
          />
          <col
            v-if="hVirtualEnabled"
            :style="{ width: `${trailingWidth}px` }"
          />
        </colgroup>
        <thead>
          <tr>
            <th
              v-if="selectionMode"
              class="vp-datatable__th vp-datatable__th--center vp-datatable__th--sticky-check"
            >
              <input
                type="checkbox"
                :checked="isAllSelected"
                :aria-label="t(LocaleKeys.common.selectAll)"
                @change="toggleSelectAll"
              />
            </th>
            <th
              v-if="hVirtualEnabled"
              class="vp-datatable__th vp-datatable__th--spacer"
              aria-hidden="true"
            />
            <th
              v-for="column in visibleColumns"
              :key="column.field"
              :data-field="column.field"
              :class="[
                'vp-datatable__th',
                `vp-datatable__th--${column.align || 'left'}`,
                {
                  'vp-datatable__th--sortable': column.sortable,
                  'vp-datatable__th--fixed-left': column.fixed === 'left',
                  'vp-datatable__th--fixed-right': column.fixed === 'right',
                },
              ]"
              :style="cellStyle(column)"
              scope="col"
              :tabindex="column.sortable ? 0 : undefined"
              :aria-sort="
                sortState(column) === 'asc'
                  ? 'ascending'
                  : sortState(column) === 'desc'
                    ? 'descending'
                    : column.sortable
                      ? 'none'
                      : undefined
              "
              @click="handleSort(column)"
              @keydown="onSortKeydown($event, column)"
            >
              <span class="vp-datatable__th-label">
                {{ column.header }}
                <span
                  v-if="sortState(column)"
                  class="vp-datatable__sort"
                  :class="`vp-datatable__sort--${sortState(column)}`"
                  aria-hidden="true"
                />
              </span>
            </th>
            <th
              v-if="hVirtualEnabled"
              class="vp-datatable__th vp-datatable__th--spacer"
              aria-hidden="true"
            />
          </tr>
          <tr v-if="hasColumnFilters" class="vp-datatable__filter-row">
            <th
              v-if="selectionMode"
              class="vp-datatable__th vp-datatable__th--filter"
            />
            <th
              v-if="hVirtualEnabled"
              class="vp-datatable__th vp-datatable__th--spacer"
              aria-hidden="true"
            />
            <th
              v-for="column in visibleColumns"
              :key="`${column.field}-filter`"
              class="vp-datatable__th vp-datatable__th--filter"
              :style="cellStyle(column)"
            >
              <label v-if="column.filter" class="vp-datatable__col-filter">
                <span class="vp-datatable__sr">
                  {{
                    t("component.datatable.columnFilter", {
                      column: column.header,
                    })
                  }}
                </span>
                <input
                  v-model="columnFilterInputs[column.field]"
                  type="search"
                  :placeholder="t(LocaleKeys.common.search)"
                />
              </label>
            </th>
            <th
              v-if="hVirtualEnabled"
              class="vp-datatable__th vp-datatable__th--spacer"
              aria-hidden="true"
            />
          </tr>
        </thead>
      </table>

      <div
        ref="bodyRef"
        class="vp-datatable__body"
        :style="bodyStyle"
        @scroll="onBodyScroll"
      >
        <div
          v-if="useVirtual"
          class="vp-datatable__virtual"
          :style="{ height: `${totalHeight}px` }"
        >
          <table
            class="vp-datatable__table"
            :style="{ transform: `translateY(${offsetY}px)` }"
          >
            <colgroup>
              <col v-if="selectionMode" class="vp-datatable__col--check" />
              <col
                v-if="hVirtualEnabled"
                :style="{ width: `${offsetX}px` }"
              />
              <col
                v-for="column in visibleColumns"
                :key="column.field"
                :style="{ width: `${columnWidthPx(column.field)}px` }"
              />
              <col
                v-if="hVirtualEnabled"
                :style="{ width: `${trailingWidth}px` }"
              />
            </colgroup>
            <tbody>
              <tr v-if="!displaySource.length">
                <td
                  :colspan="Math.max(colCount, 1)"
                  class="vp-datatable__empty"
                >
                  <slot name="empty">{{ t(LocaleKeys.common.noData) }}</slot>
                </td>
              </tr>
              <tr
                v-for="{ row, index } in displayRows"
                :key="resolveDomRowKey(row, index)"
                :data-row-key="resolveDomRowKey(row, index)"
                :class="{
                  'vp-datatable__row--selected':
                    resolveRowKey(row, index) !== null &&
                    selectedKeys.has(resolveRowKey(row, index)!),
                  'vp-datatable__row--striped': striped && index % 2 === 1,
                }"
                :style="{ height: `${itemHeight}px` }"
                @click="handleRowClick(row, index, $event)"
              >
                <td
                  v-if="selectionMode"
                  class="vp-datatable__td vp-datatable__td--center vp-datatable__td--sticky-check"
                >
                  <input
                    type="checkbox"
                    :checked="
                      resolveRowKey(row, index) !== null &&
                      selectedKeys.has(resolveRowKey(row, index)!)
                    "
                    @click.stop="toggleRowSelection(row, index, $event)"
                  />
                </td>
                <td
                  v-if="hVirtualEnabled"
                  class="vp-datatable__td vp-datatable__td--spacer"
                  aria-hidden="true"
                />
                <td
                  v-for="column in visibleColumns"
                  :key="column.field"
                  :class="[
                    'vp-datatable__td',
                    `vp-datatable__td--${column.align || 'left'}`,
                    {
                      'vp-datatable__td--fixed-left': column.fixed === 'left',
                      'vp-datatable__td--fixed-right': column.fixed === 'right',
                    },
                  ]"
                  :style="cellStyle(column)"
                >
                  <slot
                    :name="`body-${column.field}`"
                    :value="row[column.field]"
                    :row="row"
                  >
                    {{ renderCell(column, row) }}
                  </slot>
                </td>
                <td
                  v-if="hVirtualEnabled"
                  class="vp-datatable__td vp-datatable__td--spacer"
                  aria-hidden="true"
                />
              </tr>
            </tbody>
          </table>
        </div>

        <table v-else class="vp-datatable__table">
          <colgroup>
            <col v-if="selectionMode" class="vp-datatable__col--check" />
            <col
              v-for="column in cols"
              :key="column.field"
              :style="{ width: `${columnWidthPx(column.field)}px` }"
            />
          </colgroup>
          <tbody>
            <tr v-if="!displaySource.length">
              <td :colspan="Math.max(colCount, 1)" class="vp-datatable__empty">
                <slot name="empty">{{ t(LocaleKeys.common.noData) }}</slot>
              </td>
            </tr>
            <tr
              v-for="{ row, index } in displayRows"
              :key="resolveDomRowKey(row, index)"
              :data-row-key="resolveDomRowKey(row, index)"
              :class="{
                'vp-datatable__row--selected':
                  resolveRowKey(row, index) !== null &&
                  selectedKeys.has(resolveRowKey(row, index)!),
                'vp-datatable__row--striped': striped && index % 2 === 1,
              }"
              @click="handleRowClick(row, index, $event)"
            >
              <td
                v-if="selectionMode"
                class="vp-datatable__td vp-datatable__td--center"
              >
                <input
                  type="checkbox"
                  :checked="
                    resolveRowKey(row, index) !== null &&
                    selectedKeys.has(resolveRowKey(row, index)!)
                  "
                  @click.stop="toggleRowSelection(row, index, $event)"
                />
              </td>
              <td
                v-for="column in cols"
                :key="column.field"
                :class="[
                  'vp-datatable__td',
                  `vp-datatable__td--${column.align || 'left'}`,
                  {
                    'vp-datatable__td--fixed-left': column.fixed === 'left',
                    'vp-datatable__td--fixed-right': column.fixed === 'right',
                  },
                ]"
                :style="cellStyle(column)"
              >
                <slot
                  :name="`body-${column.field}`"
                  :value="row[column.field]"
                  :row="row"
                >
                  {{ renderCell(column, row) }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="vp-datatable__footer">
      <div class="vp-datatable__summary">{{ metaText }}</div>
      <div v-if="paginator" class="vp-datatable__paginator">
        <label class="vp-datatable__row-count">
          <span>{{ t("component.datatable.rowsPerPage") }}</span>
          <select :value="rows" @change="handleRowsChange">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </label>
        <button
          type="button"
          class="vp-datatable__page-btn"
          :disabled="currentPage === 1"
          :aria-label="t('component.datatable.firstPage')"
          @click="handlePageChange(1)"
        >
          «
        </button>
        <button
          type="button"
          class="vp-datatable__page-btn"
          :disabled="currentPage === 1"
          :aria-label="t(LocaleKeys.common.previous)"
          @click="handlePageChange(currentPage - 1)"
        >
          ‹
        </button>
        <span class="vp-datatable__page-info"
          >{{ currentPage }} / {{ pageCount }}</span
        >
        <button
          type="button"
          class="vp-datatable__page-btn"
          :disabled="currentPage >= pageCount"
          :aria-label="t(LocaleKeys.common.next)"
          @click="handlePageChange(currentPage + 1)"
        >
          ›
        </button>
        <button
          type="button"
          class="vp-datatable__page-btn"
          :disabled="currentPage >= pageCount"
          :aria-label="t('component.datatable.lastPage')"
          @click="handlePageChange(pageCount)"
        >
          »
        </button>
      </div>
      <slot name="footer" />
    </div>
  </div>
</template>
