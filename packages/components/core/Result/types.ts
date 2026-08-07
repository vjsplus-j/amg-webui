import type { BaseProps } from "@amg-webui/types";
export type ResultStatus =
  "success" | "warning" | "error" | "info" | "403" | "404" | "500";
export type ResultSize = "sm" | "md" | "lg";
export interface ResultAction {
  key: string;
  label: string;
  primary?: boolean;
  disabled?: boolean;
}
export interface ResultProps extends BaseProps {
  status?: ResultStatus;
  title?: string;
  subTitle?: string;
  icon?: string | false;
  image?: string;
  size?: ResultSize;
  fullScreen?: boolean;
  actions?: ResultAction[];
  live?: "polite" | "assertive" | "off";
}
export interface ResultEmits {
  (e: "extra-click", event: MouseEvent): void;
  (e: "action", key: string, event: MouseEvent): void;
}
