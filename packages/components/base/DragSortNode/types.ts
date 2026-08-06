import type { BaseProps } from "@amg-webui/types";
import type { CanvasNodeData } from "@amg-webui/utils";

export interface DragSortNodeProps extends BaseProps {
  modelValue?: CanvasNodeData[];
  nodes?: CanvasNodeData[];
  selectedId?: string | null;
  loading?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  title?: string;
  emptyText?: string;
  ariaLabel?: string;
}

export interface DragSortNodeEmits {
  (e: "update:modelValue", nodes: CanvasNodeData[]): void;
  (e: "update:selectedId", id: string | null): void;
  (e: "change", nodes: CanvasNodeData[]): void;
  (e: "reorder", nodes: CanvasNodeData[]): void;
  (e: "move", node: CanvasNodeData, from: number, to: number): void;
  (e: "select", node: CanvasNodeData): void;
  (e: "dragStart", node: CanvasNodeData, event: DragEvent): void;
  (e: "dragEnd", node: CanvasNodeData, event: DragEvent): void;
  (e: "clear"): void;
}
