import type { BaseProps } from "@amg-webui/types";
export type LoadingSize = "sm" | "md" | "lg";
export type LoadingIndicator = "spinner" | "dots";
export interface LoadingProps extends BaseProps {
  visible?: boolean;
  text?: string;
  fullscreen?: boolean;
  size?: LoadingSize;
  indicator?: LoadingIndicator;
  lockScroll?: boolean;
  backdrop?: boolean;
  delay?: number;
  progress?: number;
  cancellable?: boolean;
  cancelText?: string;
  zIndex?: number;
  live?: "polite" | "assertive" | "off";
}
export interface LoadingEmits {
  (e: "update:visible", value: boolean): void;
  (e: "visibleChange", value: boolean): void;
  (e: "cancel", event: MouseEvent): void;
  (e: "after-enter"): void;
  (e: "after-leave"): void;
}
