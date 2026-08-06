import type { BaseProps } from "@amg-webui/types";
import type { CanvasNodeData } from "@amg-webui/utils";

export interface CanvasNodeProps extends BaseProps {
  node: CanvasNodeData;
  selectable?: boolean;
  draggable?: boolean;
  keyboardStep?: number;
}

export interface CanvasNodeEmits {
  (e: "select", id: string): void;
  (e: "move", payload: { id: string; x: number; y: number }): void;
  (e: "moveStart", payload: { id: string; x: number; y: number }): void;
  (e: "moveEnd", payload: { id: string; x: number; y: number }): void;
}
