import type { BaseProps } from "@amg-webui/types";
export type PivotRecord = Record<string, unknown>;
export type PivotAggregator = "sum" | "count" | "average" | "min" | "max";
export interface PivotCell {
  rowKey: string;
  columnKey: string;
  value: number;
  records: PivotRecord[];
}
export interface PivotTableProps extends BaseProps {
  title?: string;
  description?: string;
  data?: PivotRecord[];
  rows?: PivotRecord[];
  rowField?: string;
  columnField?: string;
  /** Backward-compatible alias for columnField. */
  colField?: string;
  valueField?: string;
  aggregator?:
    PivotAggregator | ((records: PivotRecord[], valueField?: string) => number);
  valueFormatter?: (value: number, cell?: PivotCell) => string;
  modelValue?: string | null;
  rowLabel?: string;
  showRowTotals?: boolean;
  showColumnTotals?: boolean;
  stickyHeader?: boolean;
  loading?: boolean;
  disabled?: boolean;
}
export interface PivotTableEmits {
  (e: "update:modelValue", value: string | null): void;
  (e: "change", value: string | null): void;
  (e: "cellClick", cell: PivotCell, event: MouseEvent): void;
  (e: "rowClick", rowKey: string, event: MouseEvent): void;
}
