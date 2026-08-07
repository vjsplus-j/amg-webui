import type { BaseProps } from "@amg-webui/types";

export type TableDragKey = string | number;
export type TableDragRow = Record<string, unknown>;

export interface TableDragColumn {
  field: string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface TableDragProps extends BaseProps {
  title?: string;
  description?: string;
  rows?: TableDragRow[];
  data?: TableDragRow[];
  modelValue?: TableDragRow[];
  columns?: TableDragColumn[];
  rowKey?: string | ((row: TableDragRow, index: number) => TableDragKey);
  selectedKey?: TableDragKey | null;
  rowDisabled?: (row: TableDragRow, index: number) => boolean;
  disabled?: boolean;
  loading?: boolean;
  striped?: boolean;
  emptyText?: string;
  ariaLabel?: string;
}

export interface TableDragEmits {
  (e: "update:modelValue", value: TableDragRow[]): void;
  (e: "update:selectedKey", value: TableDragKey): void;
  (e: "change", value: TableDragRow[]): void;
  (
    e: "reorder",
    value: TableDragRow[],
    row: TableDragRow,
    from: number,
    to: number,
  ): void;
  (e: "dragStart", row: TableDragRow, index: number, event: DragEvent): void;
  (e: "dragEnd", row: TableDragRow, index: number, event: DragEvent): void;
  (e: "rowClick", row: TableDragRow, index: number, event: MouseEvent): void;
  (e: "click", event: MouseEvent): void;
}
