import type { BaseProps, DisabledProps, InvalidProps } from "@amg-webui/types";

export interface TransferItem {
  key: string | number;
  label: string;
  disabled?: boolean;
}

export interface TransferProps extends BaseProps, DisabledProps, InvalidProps {
  /** Native id — falls back to FormItem field id when nested */
  id?: string;
  /** Native name — falls back to FormItem `prop` when nested */
  name?: string;
  data?: TransferItem[];
  modelValue?: (string | number)[];
  filterable?: boolean;
  leftTitle?: string;
  rightTitle?: string;
  filterPlaceholder?: string;
  emptyText?: string;
  /** Delay filtering for large data sets. @default 200 */
  filterDebounce?: number;
  /** Custom filter predicate. */
  filterMethod?: (
    query: string,
    item: TransferItem,
    direction: "left" | "right",
  ) => boolean;
  /** Native virtual scrolling is enabled by default. */
  virtual?: boolean;
  /** Marks both panels busy while data is being fetched. */
  loading?: boolean;
}

export interface TransferEmits {
  (e: "update:modelValue", value: (string | number)[]): void;
  (e: "change", value: (string | number)[]): void;
  (
    e: "move",
    payload: { direction: "left" | "right"; keys: (string | number)[] },
  ): void;
  (
    e: "filter-change",
    payload: { direction: "left" | "right"; query: string },
  ): void;
  (e: "reach-end", direction: "left" | "right"): void;
}
