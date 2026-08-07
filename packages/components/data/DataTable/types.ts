import { BaseProps } from "@amg-webui/types";

export type SortOrder = "asc" | "desc" | null;

export type RowKey = string | number;

/** Pointer or keyboard event that initiated a row interaction */
export type DataTableRowInteractionEvent = MouseEvent | KeyboardEvent;

export interface DataTableRowSelectEvent<T = any> {
  originalEvent: DataTableRowInteractionEvent;
  data: T;
  checked: boolean;
}

export interface DataTableRowClickEvent<T = any> {
  originalEvent: DataTableRowInteractionEvent;
  data: T;
}

export interface Column<T = any> {
  field: string;
  header: string;
  sortable?: boolean;
  /** Per-column text filter input in header */
  filter?: boolean;
  style?: Record<string, string>;
  width?: string;
  /** Sticky freeze — works with horizontal virtualization spacers */
  fixed?: "left" | "right";
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => string | any | null;
}

export interface DataTableProps<T = any> extends BaseProps {
  value?: T[];
  columns: Column<T>[];
  /** Field name used as stable row identity (default `id`). Required when selection or virtual scroll is enabled. */
  rowKey?: string;
  /** Selected row keys — use with v-model:selection */
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
  /** Delegate sorting, filtering and pagination to the consumer. */
  lazy?: boolean;
  /** Delay local filtering and lazy filter events. */
  filterDebounce?: number;
  /**
   * Virtual scroll for the current display set. Default ON.
   * Works with paginator (virtualizes the current page). Set false to render full DOM for the page/list.
   */
  virtual?: boolean;
  /** Viewport height as spacing-xs multiples (synced into virtual math + CSS). */
  virtualHeight?: number;
  /**
   * Optional fixed row height in CSS px. When omitted, uses `--theme-table-row-height`
   * then refines via ResizeObserver on the first rendered row.
   */
  rowHeight?: number;
  /**
   * Horizontal column windowing. Default: auto-enable when column count ≥ `virtualColumnThreshold`.
   */
  virtualColumns?: boolean;
  /** Column count that triggers auto horizontal virtualization (default 8). */
  virtualColumnThreshold?: number;
  /** Local sort switches to Worker above this row count (default 5000). */
  sortWorkerThreshold?: number;
  trackId?: string;
  telemetry?: boolean;
}

export interface DataTableEmits<T = any> {
  (e: "update:value", value: T[]): void;
  (e: "update:selection", keys: RowKey[]): void;
  (e: "update:sortField", field: string): void;
  (e: "update:sortOrder", order: SortOrder): void;
  (e: "update:first", first: number): void;
  (e: "update:rows", rows: number): void;
  (e: "sort", event: { field: string; order: SortOrder }): void;
  (e: "row-select", event: DataTableRowSelectEvent<T>): void;
  (e: "row-click", event: DataTableRowClickEvent<T>): void;
  (
    e: "page",
    event: { first: number; rows: number; page: number; pageCount: number },
  ): void;
  (
    e: "filter",
    event: { global: string; fields: Record<string, string> },
  ): void;
}

export interface DataTableSlots<T = unknown> {
  header?: () => unknown
  footer?: () => unknown
  empty?: () => unknown
  loading?: () => unknown
  [key: `body-${string}`]: (props: { value: unknown; row: T }) => unknown
}

export interface DataTableExpose {
  /** Scroll the virtual viewport to a row index or stable row key */
  scrollTo: (options: { rowIndex?: number; key?: RowKey }) => void
}

export type DataTableInstance = DataTableExpose
