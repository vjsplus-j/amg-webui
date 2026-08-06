import type { BaseProps } from "@amg-webui/types";
import type {
  TreeNode,
  TreeLoadFn,
} from "@amg-webui/utils/data-display/tree-types";

/** Shared tree panel props — Tree / VirtualTree / LazyTree */
export interface BaseTreeProps extends BaseProps {
  title?: string;
  description?: string;
  /** Alias for `options` — tree node array */
  data?: TreeNode[];
  options?: TreeNode[];
  /** Checked keys when `checkable`; single value when browse-only */
  modelValue?: unknown;
  checkable?: boolean;
  /** Parent/child checkbox linkage (EP semantics). Default false = cascade. */
  checkStrictly?: boolean;
  defaultExpandAll?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /** Delay recursive local filtering for large trees. */
  filterDebounce?: number;
}

export type { TreeNode, TreeLoadFn };

export interface TreeProps extends BaseTreeProps {
  /** Force virtual scroll on/off. When omitted it auto-enables above `virtualThreshold`. */
  virtual?: boolean;
  virtualThreshold?: number;
}

export interface TreeEmits {
  (e: "update:modelValue", value: unknown): void;
  (e: "change", value: unknown): void;
  (e: "node-click", node: TreeNode): void;
  (
    e: "check-change",
    node: TreeNode,
    checked: boolean,
    indeterminate: boolean,
  ): void;
  (e: "node-expand", node: TreeNode): void;
  (e: "node-collapse", node: TreeNode): void;
}

export interface VirtualTreeProps extends BaseTreeProps {
  /** Virtual scroll on by default */
  virtual?: boolean;
}

export interface VirtualTreeEmits extends TreeEmits {}

export interface LazyTreeProps extends BaseTreeProps {
  /** Async loader — return children for the expanded node */
  load?: TreeLoadFn;
  /** Force virtual scroll on/off. When omitted it auto-enables above `virtualThreshold`. */
  virtual?: boolean;
  virtualThreshold?: number;
}

export interface LazyTreeEmits extends TreeEmits {
  (
    e: "load",
    ctx: import("@amg-webui/utils/data-display/tree-types").LazyLoadContext,
  ): void;
  (e: "load-error", error: Error, node: TreeNode): void;
}
