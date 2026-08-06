import type { BaseProps, Severity } from "@amg-webui/types";

export type MessageVariant = "soft" | "outlined" | "filled";
export type MessageCloseReason = "close" | "timeout" | "programmatic";

export interface MessageProps extends BaseProps {
  visible?: boolean;
  severity?: Severity;
  title?: string;
  text?: string;
  showIcon?: boolean;
  closable?: boolean;
  autoHide?: boolean;
  hideDelay?: number;
  pauseOnHover?: boolean;
  showProgress?: boolean;
  variant?: MessageVariant;
  actionText?: string;
  ariaLive?: "polite" | "assertive" | "off";
  trackId?: string;
  telemetry?: boolean;
}

export interface MessageEmits {
  (e: "update:visible", value: boolean): void;
  (e: "close", reason: MessageCloseReason, event?: Event): void;
  (e: "action", event: MouseEvent): void;
  (e: "closed"): void;
}
