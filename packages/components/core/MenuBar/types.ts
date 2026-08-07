import type { BaseProps } from "@amg-webui/types";

export interface MenuBarItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  /** Visual separator — filtered out when mapping to Menu */
  divider?: boolean;
  children?: MenuBarItem[];
  command?: string;
}

export interface MenuBarProps extends BaseProps {
  modelValue?: string;
  items?: MenuBarItem[];
  disabled?: boolean;
  ariaLabel?: string;
}

export interface MenuBarEmits {
  (e: "update:modelValue", value: string): void;
  (e: "command", command: string, item: MenuBarItem): void;
  (e: "change", value: string): void;
}
