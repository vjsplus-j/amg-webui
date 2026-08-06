import type { BaseProps } from "@amg-webui/types";
import type { CanvasMaterialItem } from "@amg-webui/utils";

export interface DragMaterialProps extends BaseProps {
  materials?: CanvasMaterialItem[];
  filter?: string;
  group?: string;
  searchable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  emptyText?: string;
  ariaLabel?: string;
}

export interface DragMaterialEmits {
  (e: "update:filter", query: string): void;
  /** @deprecated Use `dragStart`. Kept for compatibility with the original API. */
  (e: "drag-start", material: CanvasMaterialItem): void;
  (e: "dragStart", material: CanvasMaterialItem, event: DragEvent): void;
  (e: "dragEnd", material: CanvasMaterialItem, event: DragEvent): void;
  (e: "search", query: string): void;
  (
    e: "pick",
    material: CanvasMaterialItem,
    event: MouseEvent | KeyboardEvent,
  ): void;
}
