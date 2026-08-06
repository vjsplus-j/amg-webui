import type { BaseProps } from "@amg-webui/types";
import type { CanvasNodeData } from "@amg-webui/utils";

export interface CanvasPreviewProps extends BaseProps {
  nodes?: CanvasNodeData[];
  modelValue?: string | null;
  mode?: "free" | "grid";
  scale?: number | "fit";
  minScale?: number;
  maxScale?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  columns?: number;
  showGrid?: boolean;
  loading?: boolean;
  disabled?: boolean;
  interactive?: boolean;
  title?: string;
  emptyText?: string;
  ariaLabel?: string;
}

export interface CanvasPreviewEmits {
  (e: "update:modelValue", id: string | null): void;
  (e: "change", id: string | null): void;
  (e: "select", id: string): void;
  (
    e: "nodeActivate",
    node: CanvasNodeData,
    event: MouseEvent | KeyboardEvent,
  ): void;
  (e: "scaleChange", scale: number): void;
  (e: "refresh"): void;
}
