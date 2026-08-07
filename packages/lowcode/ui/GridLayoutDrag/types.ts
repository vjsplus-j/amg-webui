import type { BaseProps } from "@amg-webui/types";

export interface GridLayoutDragProps extends BaseProps {
  cols?: number;
  enabled?: boolean;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  telemetry?: boolean;
  trackId?: string;
}

export interface GridLayoutDragEmits {
  (e: "update:enabled", enabled: boolean): void;
  (e: "mode", mode: "grid"): void;
  (e: "toggle", enabled: boolean): void;
}
