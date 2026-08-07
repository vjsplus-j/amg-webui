import type { BaseProps } from "@amg-webui/types";
export interface OnvifGroupNode {
  label: string;
  value: string | number;
  children?: OnvifGroupNode[];
  disabled?: boolean;
  status?: string;
}
export interface OnvifGroupTreeProps extends BaseProps {
  title?: string;
  description?: string;
  data?: OnvifGroupNode[];
  options?: OnvifGroupNode[];
  modelValue?: Array<string | number>;
  expandedKeys?: Array<string | number>;
  filter?: string;
  disabled?: boolean;
  loading?: boolean;
  checkStrategy?: "all" | "leaf";
}
export interface OnvifGroupTreeEmits {
  (e: "update:modelValue", value: Array<string | number>): void;
  (e: "update:expandedKeys", value: Array<string | number>): void;
  (e: "change", value: Array<string | number>): void;
  (e: "check", node: OnvifGroupNode, checked: boolean): void;
  (e: "expand", node: OnvifGroupNode, expanded: boolean): void;
}
