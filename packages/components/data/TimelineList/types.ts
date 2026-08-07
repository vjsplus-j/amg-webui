import type { BaseProps } from "@amg-webui/types";

export type TimelineListKey = string | number;
export type TimelineListStatus = "success" | "warning" | "danger" | "info";

export interface TimelineListItem {
  id?: TimelineListKey;
  itemKey?: TimelineListKey;
  time: string | number | Date;
  title: string;
  status?: TimelineListStatus;
  content?: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  data?: unknown;
}

export interface TimelineListProps extends BaseProps {
  title?: string;
  description?: string;
  items?: TimelineListItem[];
  data?: TimelineListItem[];
  modelValue?: TimelineListKey | null;
  selectable?: boolean;
  reverse?: boolean;
  groupBy?: "day" | "none" | ((item: TimelineListItem) => string);
  collapsible?: boolean;
  defaultExpandedKeys?: string[];
  disabled?: boolean;
  loading?: boolean;
  pending?: boolean | string;
  emptyText?: string;
  ariaLabel?: string;
}

export interface TimelineListEmits {
  (e: "update:modelValue", value: TimelineListKey): void;
  (e: "change", value: TimelineListKey, item: TimelineListItem): void;
  (
    e: "itemClick",
    item: TimelineListItem,
    index: number,
    event: MouseEvent | KeyboardEvent,
  ): void;
  (e: "groupToggle", key: string, expanded: boolean): void;
  (e: "click", event: MouseEvent): void;
}
