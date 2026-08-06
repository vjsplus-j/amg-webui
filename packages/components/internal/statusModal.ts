import type { BaseProps, Severity } from "@amg-webui/types";

export type StatusModalCloseReason = "cancel" | "close" | "overlay" | "escape";
export type StatusModalInitialFocus = "confirm" | "cancel" | "dialog" | "none";
export type StatusModalAction = "confirm" | "cancel";

export interface StatusModalProps extends BaseProps {
  visible?: boolean;
  title?: string;
  message?: string;
  severity?: Severity;
  closable?: boolean;
  dismissible?: boolean;
  closeOnClickOverlay?: boolean;
  closeOnPressEscape?: boolean;
  lockScroll?: boolean;
  showCancel?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  width?: string;
  zIndex?: number;
  teleportTo?: string | HTMLElement;
  initialFocus?: StatusModalInitialFocus;
  beforeConfirm?: (event: MouseEvent) => boolean | Promise<boolean>;
  beforeCancel?: (
    reason: StatusModalCloseReason,
    event?: Event,
  ) => boolean | Promise<boolean>;
  trackId?: string;
  telemetry?: boolean;
}

export interface StatusModalEmits {
  (e: "update:visible", value: boolean): void;
  (e: "confirm", event: MouseEvent): void;
  (e: "cancel", event: Event | undefined, reason: StatusModalCloseReason): void;
  (e: "close", reason: StatusModalCloseReason, event?: Event): void;
  (e: "open"): void;
  (e: "closed"): void;
  (e: "error", error: unknown, action: StatusModalAction): void;
}
