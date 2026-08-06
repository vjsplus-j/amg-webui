import type { BaseProps } from "@amg-webui/types";

export type MergeTableRow = Record<string, unknown>;
export interface MergeTableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  formatter?: (value: unknown, row: MergeTableRow, rowIndex: number) => unknown;
}
export type MergeTableRowKey =
  string | ((row: MergeTableRow, index: number) => string | number);

export interface MergeTableProps extends BaseProps {
  title?: string;
  description?: string;
  data?: MergeTableRow[];
  rows?: MergeTableRow[];
  columns?: MergeTableColumn[];
  mergeField?: string;
  mergeFields?: string[];
  rowKey?: MergeTableRowKey;
  modelValue?: string | number | MergeTableRow | null;
  disabled?: boolean;
  loading?: boolean;
  bordered?: boolean;
  striped?: boolean;
  stickyHeader?: boolean;
  emptyText?: string;
  ariaLabel?: string;
}

export interface MergeTableEmits {
  (e: "update:modelValue", value: string | number | MergeTableRow): void;
  (e: "change", row: MergeTableRow, rowIndex: number): void;
  (
    e: "rowClick",
    row: MergeTableRow,
    rowIndex: number,
    event: MouseEvent | KeyboardEvent,
  ): void;
  (
    e: "sortChange",
    field: string | null,
    direction: "asc" | "desc" | null,
  ): void;
}
