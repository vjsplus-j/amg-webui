<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { useVirtualList } from "@amg-webui/utils/data-display/useVirtualList";
import { trackEmit } from "@amg-webui/telemetry";
import type { Column, RowKey, SortOrder } from "./types";
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
    /** Viewport height as spacing-xs multiples */
    virtualHeight?: number;
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
    event: { originalEvent: MouseEvent; data: any; checked: boolean },
  ];
  "row-click": [event: { originalEvent: MouseEvent; data: any }];
  page: [
    event: { first: number; rows: number; page: number; pageCount: number },
  ];
  filter: [event: { global: string; fields: Record<string, string> }];
}>();

const { t } = useLocale();

const localValue = ref<any[]>([]);
const selectedKeys = ref<Set<RowKey>>(new Set());
const bodyRef = ref<HTMLElement | null>(null);
const globalFilterInput = ref("");
const globalFilter = ref("");
const columnFilterInputs = ref<Record<string, string>>({});
const columnFilters = ref<Record<string, string>>({});
const innerSortField = ref<string | undefined>();
const innerSortOrder = ref<SortOrder>(null);

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
});

function resolveRowKey(row: any, index?: number): RowKey {
  const key = row?.[props.rowKey];
  if (key !== undefined && key !== null) return key as RowKey;
  return index ?? 0;
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

const filteredData = computed(() => {
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
  const field = innerSortField.value;
  const order = innerSortOrder.value;
  if (field && order) {
    const dir = order === "asc" ? 1 : -1;
    list = [...list].sort((a, b) => {
      const av = a?.[field];
      const bv = b?.[field];
      if (av == null && bv == null) return 0;
      if (av == null) return -1 * dir;
      if (bv == null) return 1 * dir;
      if (typeof av === "number" && typeof bv === "number")
        return (av - bv) * dir;
      return (
        String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir
      );
    });
  }
  return list;
});

/** Virtual applies to the current display set (full list or current page). */
const useVirtual = computed(() => props.virtual !== false);

const displaySource = computed(() => {
  const list = filteredData.value;
  if (props.paginator) {
    if (props.lazy) return list;
    return list.slice(props.first, props.first + props.rows);
  }
  return list;
});

const rowRef = computed(() => displaySource.value);
const {
  visibleItems,
  totalHeight,
  offsetY,
  itemHeight,
  onScroll,
  reset: resetVirtual,
} = useVirtualList(rowRef, {
  containerHeight: 320,
  itemHeight: 44,
  containerRef: bodyRef,
});

watch([globalFilter, columnFilters], resetVirtual, { deep: true });

const displayRows = computed(() => {
  if (useVirtual.value) {
    return visibleItems.value.map(({ item, index }) => ({ row: item, index }));
  }
  return displaySource.value.map((row, index) => ({ row, index }));
});

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
  () => cols.value.length + (props.selectionMode ? 1 : 0),
);

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

function handleRowClick(row: any, event: MouseEvent) {
  emit("row-click", { originalEvent: event, data: row });
  if (props.selectionMode) toggleRowSelection(row, event);
}

function toggleRowSelection(row: any, event: MouseEvent) {
  if (!props.selectionMode) return;
  const key = resolveRowKey(row);
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
  if (checked) {
    for (const row of filteredData.value) {
      selectedKeys.value.add(resolveRowKey(row));
    }
  } else {
    for (const row of filteredData.value) {
      selectedKeys.value.delete(resolveRowKey(row));
    }
  }
  emitSelection();
}

const isAllSelected = computed(
  () =>
    filteredData.value.length > 0 &&
    filteredData.value.every((row) =>
      selectedKeys.value.has(resolveRowKey(row)),
    ),
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
</script>

<template>
  <div :class="['vp-datatable', props.class]" :style="style">
    <div
      v-if="loading"
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

    <div class="vp-datatable__scroll">
      <!-- Sticky header table (outside scroll body) -->
      <table
        class="vp-datatable__table vp-datatable__table--head"
        role="presentation"
      >
        <colgroup>
          <col v-if="selectionMode" class="vp-datatable__col--check" />
          <col
            v-for="column in cols"
            :key="column.field"
            :style="column.width ? { width: column.width } : undefined"
          />
        </colgroup>
        <thead>
          <tr>
            <th
              v-if="selectionMode"
              class="vp-datatable__th vp-datatable__th--center"
            >
              <input
                type="checkbox"
                :checked="isAllSelected"
                :aria-label="t(LocaleKeys.common.selectAll)"
                @change="toggleSelectAll"
              />
            </th>
            <th
              v-for="column in cols"
              :key="column.field"
              :class="[
                'vp-datatable__th',
                `vp-datatable__th--${column.align || 'left'}`,
                { 'vp-datatable__th--sortable': column.sortable },
              ]"
              scope="col"
              @click="handleSort(column)"
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
          </tr>
          <tr v-if="hasColumnFilters" class="vp-datatable__filter-row">
            <th
              v-if="selectionMode"
              class="vp-datatable__th vp-datatable__th--filter"
            />
            <th
              v-for="column in cols"
              :key="`${column.field}-filter`"
              class="vp-datatable__th vp-datatable__th--filter"
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
          </tr>
        </thead>
      </table>

      <div
        ref="bodyRef"
        class="vp-datatable__body"
        :style="bodyStyle"
        @scroll="useVirtual ? onScroll($event) : undefined"
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
                v-for="column in cols"
                :key="column.field"
                :style="column.width ? { width: column.width } : undefined"
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
                :key="resolveRowKey(row, index)"
                :class="{
                  'vp-datatable__row--selected': selectedKeys.has(
                    resolveRowKey(row, index),
                  ),
                  'vp-datatable__row--striped': striped && index % 2 === 1,
                }"
                :style="{ height: `${itemHeight}px` }"
                @click="handleRowClick(row, $event)"
              >
                <td
                  v-if="selectionMode"
                  class="vp-datatable__td vp-datatable__td--center"
                >
                  <input
                    type="checkbox"
                    :checked="selectedKeys.has(resolveRowKey(row, index))"
                    @click.stop="toggleRowSelection(row, $event)"
                  />
                </td>
                <td
                  v-for="column in cols"
                  :key="column.field"
                  :class="[
                    'vp-datatable__td',
                    `vp-datatable__td--${column.align || 'left'}`,
                  ]"
                  :style="column.style"
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

        <table v-else class="vp-datatable__table">
          <colgroup>
            <col v-if="selectionMode" class="vp-datatable__col--check" />
            <col
              v-for="column in cols"
              :key="column.field"
              :style="column.width ? { width: column.width } : undefined"
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
              :key="resolveRowKey(row, index)"
              :class="{
                'vp-datatable__row--selected': selectedKeys.has(
                  resolveRowKey(row, index),
                ),
                'vp-datatable__row--striped': striped && index % 2 === 1,
              }"
              @click="handleRowClick(row, $event)"
            >
              <td
                v-if="selectionMode"
                class="vp-datatable__td vp-datatable__td--center"
              >
                <input
                  type="checkbox"
                  :checked="selectedKeys.has(resolveRowKey(row, index))"
                  @click.stop="toggleRowSelection(row, $event)"
                />
              </td>
              <td
                v-for="column in cols"
                :key="column.field"
                :class="[
                  'vp-datatable__td',
                  `vp-datatable__td--${column.align || 'left'}`,
                ]"
                :style="column.style"
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
