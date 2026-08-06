import type { BaseProps, Severity } from "@amg-webui/types";

export type ProgressTipSize = "sm" | "md" | "lg";
export type ProgressTipState = "active" | "paused" | "success" | "error";

export interface ProgressTipProps extends BaseProps {
  modelValue?: number;
  title?: string;
  description?: string;
  message?: string;
  percentage?: number;
  severity?: Severity;
  size?: ProgressTipSize;
  showText?: boolean;
  striped?: boolean;
  indeterminate?: boolean;
  closable?: boolean;
  currentStep?: number;
  totalSteps?: number;
  actionText?: string;
  state?: ProgressTipState;
  cancellable?: boolean;
  cancelText?: string;
  retryable?: boolean;
  retryText?: string;
  trackId?: string;
  telemetry?: boolean;
}

export interface ProgressTipEmits {
  (e: "update:modelValue", value: number): void;
  (e: "complete"): void;
  (e: "close"): void;
  (e: "action", event: MouseEvent): void;
  (e: "cancel", event: MouseEvent): void;
  (e: "retry", event: MouseEvent): void;
  (e: "pause", event: MouseEvent): void;
  (e: "resume", event: MouseEvent): void;
}
