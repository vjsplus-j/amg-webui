import type { BaseProps, Severity } from "@amg-webui/types";
import type { FloatingPlacement } from "@amg-webui/utils/domPanel";

export type PopconfirmCloseReason =
  "cancel" | "outside" | "escape" | "programmatic";

export interface PopconfirmProps extends BaseProps {
  visible?: boolean;
  title?: string;
  description?: string;
  placement?: FloatingPlacement;
  dismissible?: boolean;
  disabled?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  severity?: Severity;
  loading?: boolean;
  showIcon?: boolean;
  offset?: number;
  zIndex?: number;
  teleportTo?: string | HTMLElement;
  beforeConfirm?: (event: MouseEvent) => boolean | Promise<boolean>;
  beforeCancel?: (
    reason: PopconfirmCloseReason,
    event?: Event,
  ) => boolean | Promise<boolean>;
  trackId?: string;
  telemetry?: boolean;
}

export interface PopconfirmEmits {
  (e: "update:visible", value: boolean): void;
  (e: "confirm", event: MouseEvent): void;
  (e: "cancel", event: Event, reason: PopconfirmCloseReason): void;
  (e: "openChange", value: boolean, reason?: PopconfirmCloseReason): void;
  (e: "error", error: unknown, action: "confirm" | "cancel"): void;
}
