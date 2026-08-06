import type { BaseProps, Position, Severity } from "@amg-webui/types";

export type NoticeCloseReason = "close" | "timeout" | "programmatic";

export interface NoticeProps extends BaseProps {
  visible?: boolean;
  title?: string;
  message?: string;
  severity?: Severity;
  duration?: number;
  closable?: boolean;
  position?: Position;
  showIcon?: boolean;
  pauseOnHover?: boolean;
  showProgress?: boolean;
  actionText?: string;
  teleport?: boolean;
  teleportTo?: string | HTMLElement;
  zIndex?: number;
  ariaLive?: "polite" | "assertive" | "off";
  trackId?: string;
  telemetry?: boolean;
}

export interface NoticeEmits {
  (e: "update:visible", value: boolean): void;
  (e: "close", reason: NoticeCloseReason, event?: Event): void;
  (e: "action", event: MouseEvent): void;
  (e: "click", event: MouseEvent): void;
  (e: "open"): void;
  (e: "closed"): void;
}
