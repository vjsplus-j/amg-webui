import type { BaseProps } from "@amg-webui/types";

export interface VcrStorageVolume {
  id: string;
  name: string;
  used: number;
  total: number;
  status?: "healthy" | "warning" | "error" | "offline";
  writable?: boolean;
  description?: string;
  data?: unknown;
}
export interface VcrStorageSummary {
  used: number;
  total: number;
  available: number;
  percent: number;
}
export interface VcrStorageDashboardProps extends BaseProps {
  volumes?: VcrStorageVolume[];
  selectedId?: string | null;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  warningThreshold?: number;
  dangerThreshold?: number;
  valueFormatter?: (value: number) => string;
  emptyText?: string;
  ariaLabel?: string;
}
export interface VcrStorageDashboardEmits {
  (e: "update:selectedId", id: string | null): void;
  (e: "refresh"): void;
  (e: "export", volumes: VcrStorageVolume[], summary: VcrStorageSummary): void;
  (e: "select", volume: VcrStorageVolume): void;
}
