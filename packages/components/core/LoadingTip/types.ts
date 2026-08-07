import type { BaseProps } from "@amg-webui/types";
export type LoadingTipSize = "sm" | "md" | "lg";
export interface LoadingTipProps extends BaseProps {
  message?: string;
  loading?: boolean;
  size?: LoadingTipSize;
  delay?: number;
  block?: boolean;
  overlay?: boolean;
  persistent?: boolean;
  live?: "polite" | "assertive" | "off";
  progress?: number;
  cancellable?: boolean;
  cancelText?: string;
}
export interface LoadingTipEmits {
  (e: "show"): void;
  (e: "hide"): void;
  (e: "cancel", event: MouseEvent): void;
}
