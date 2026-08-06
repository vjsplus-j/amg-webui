import type { BaseProps } from "@amg-webui/types";

export interface TablePrintProps extends BaseProps {
  columns?: {
    key: string;
    label?: string;
    formatter?: (
      value: unknown,
      row: Record<string, unknown>,
      index: number,
    ) => string;
  }[];
  data?: Record<string, unknown>[];
  title?: string;
  disabled?: boolean;
  bordered?: boolean;
  showToolbar?: boolean;
  emptyText?: string;
}

export interface TablePrintEmits {
  (e: "print"): void;
  (e: "before-print"): void;
  (e: "after-print"): void;
  (e: "error", error: Error): void;
}
