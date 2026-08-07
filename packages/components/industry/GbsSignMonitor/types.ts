import type { BaseProps } from "@amg-webui/types";

export interface GbsSignEntry {
  id: string;
  type: string;
  message: string;
  time: string | number | Date;
  direction?: "in" | "out";
  status?: string | number;
  raw?: unknown;
}
export interface GbsSignMonitorProps extends BaseProps {
  logs?: GbsSignEntry[];
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  filter?: string;
  type?: string;
  selectedId?: string | null;
  autoFollow?: boolean;
  clearable?: boolean;
  emptyText?: string;
  ariaLabel?: string;
}
export interface GbsSignMonitorEmits {
  (e: "update:logs", logs: GbsSignEntry[]): void;
  (e: "update:filter", filter: string): void;
  (e: "update:type", type: string): void;
  (e: "update:selectedId", id: string | null): void;
  (e: "refresh"): void;
  (e: "clear"): void;
  (e: "select", entry: GbsSignEntry): void;
  (e: "filterChange", filter: string, type: string): void;
}
