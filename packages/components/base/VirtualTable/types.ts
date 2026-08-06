import type { BaseProps } from "@amg-webui/types";
import type { TableColumn } from "@amg-webui/utils/data-display/useTableState";

export interface VirtualTableProps extends BaseProps {
  title?: string;
  description?: string;
  /** Legacy alias — prefer `rows` */
  data?: Record<string, unknown>[];
  rows?: Record<string, unknown>[];
  columns?: TableColumn[];
  /** Virtual scroll (default ON) */
  virtual?: boolean;
  rowKey?: string;
  filterDebounce?: number;
  modelValue?: Record<string, unknown> | null;
  disabled?: boolean;
  loading?: boolean;
  trackId?: string;
  telemetry?: boolean;
}

export interface VirtualTableEmits {
  (e: "update:modelValue", value: Record<string, unknown>): void;
  (e: "change", value: Record<string, unknown>): void;
  (e: "click", event: MouseEvent): void;
}

export interface VirtualTableSlots {
  default?: () => unknown;
  loading?: () => unknown;
  empty?: () => unknown;
}
