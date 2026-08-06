import type { BaseProps } from "@amg-webui/types";

export interface FreeLayoutDragProps extends BaseProps {
  enabled?: boolean;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  telemetry?: boolean;
  trackId?: string;
  modelValue?: { x: number; y: number };
  draggable?: boolean;
  axis?: "both" | "x" | "y";
  constrainToParent?: boolean;
  activeText?: string;
  inactiveText?: string;
}

export interface FreeLayoutDragEmits {
  (e: "mode", mode: "free"): void;
  (e: "toggle", enabled: boolean): void;
  (e: "update:enabled", enabled: boolean): void;
  (e: "update:modelValue", value: { x: number; y: number }): void;
  (e: "change", value: { x: number; y: number }): void;
  (e: "drag-start", value: { x: number; y: number }, event: PointerEvent): void;
  (e: "drag", value: { x: number; y: number }, event: PointerEvent): void;
  (e: "drag-end", value: { x: number; y: number }, event: PointerEvent): void;
}
