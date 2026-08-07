import type { BaseProps } from "@amg-webui/types";
export interface WaterfallItem {
  id: string | number;
  title?: string;
  description?: string;
  image?: string;
  alt?: string;
  height?: number;
  disabled?: boolean;
  data?: unknown;
}
export interface WaterfallProps extends BaseProps {
  title?: string;
  description?: string;
  data?: WaterfallItem[];
  items?: WaterfallItem[];
  modelValue?: string | number | null;
  columns?: number;
  disabled?: boolean;
  loading?: boolean;
  clickable?: boolean;
  emptyText?: string;
}
export interface WaterfallEmits {
  (e: "update:modelValue", value: string | number): void;
  (e: "change", value: string | number): void;
  (
    e: "itemClick",
    item: WaterfallItem,
    event: MouseEvent | KeyboardEvent,
  ): void;
  (e: "imageLoad", item: WaterfallItem, event: Event): void;
  (e: "imageError", item: WaterfallItem, event: Event): void;
  (e: "layoutChange", columns: WaterfallItem[][]): void;
  (e: "reachEnd"): void;
}
