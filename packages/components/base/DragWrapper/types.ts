import type { BaseProps } from "@amg-webui/types";

export interface DragWrapperProps extends BaseProps {
  label?: string;
  nested?: boolean;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  accept?: string[];
  telemetry?: boolean;
  trackId?: string;
}

export interface DragWrapperEmits {
  (e: "drop", type: string): void;
  (
    e: "dropData",
    payload: { type: string; data: string; event: DragEvent },
  ): void;
  (e: "dragEnter", event: DragEvent): void;
  (e: "dragLeave", event: DragEvent): void;
  (e: "clear"): void;
}
