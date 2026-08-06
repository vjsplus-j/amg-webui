import type { BaseProps } from "@amg-webui/types";

export interface GbsAlarmInfo {
  id: string | number;
  title?: string;
  description?: string;
  deviceName?: string;
  deviceId?: string;
  channelName?: string;
  time?: string | number | Date;
  severity?: "info" | "warning" | "danger" | "critical";
  details?: Record<string, unknown>;
  raw?: unknown;
}
export type GbsAlarmCloseReason = "acknowledge" | "close" | "mask" | "escape";

export interface GbsAlarmModalProps extends BaseProps {
  open?: boolean;
  alarm?: GbsAlarmInfo | null;
  title?: string;
  description?: string;
  disabled?: boolean;
  loading?: boolean;
  closable?: boolean;
  maskClosable?: boolean;
  closeOnEscape?: boolean;
  lockScroll?: boolean;
  destroyOnClose?: boolean;
  teleportTo?: string | HTMLElement;
  ariaLabel?: string;
}

export interface GbsAlarmModalEmits {
  (e: "update:open", value: boolean): void;
  (e: "acknowledge", alarm: GbsAlarmInfo | null): void;
  (e: "close", reason: GbsAlarmCloseReason): void;
  (e: "open"): void;
  (e: "afterOpen"): void;
}
