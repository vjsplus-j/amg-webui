import type { BaseProps } from "@amg-webui/types";
export interface GbsDeviceNode {
  label: string;
  value: string | number;
  children?: GbsDeviceNode[];
  disabled?: boolean;
  status?: string;
}
export interface GbsDeviceTreeProps extends BaseProps {
  title?: string;
  description?: string;
  data?: GbsDeviceNode[];
  options?: GbsDeviceNode[];
  modelValue?: Array<string | number>;
  expandedKeys?: Array<string | number>;
  filter?: string;
  disabled?: boolean;
  loading?: boolean;
  checkStrategy?: "all" | "leaf";
}
export interface GbsDeviceTreeEmits {
  (e: "update:modelValue", value: Array<string | number>): void;
  (e: "update:expandedKeys", value: Array<string | number>): void;
  (e: "change", value: Array<string | number>): void;
  (e: "check", node: GbsDeviceNode, checked: boolean): void;
  (e: "expand", node: GbsDeviceNode, expanded: boolean): void;
}
