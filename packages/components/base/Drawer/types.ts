import type { BaseProps } from "@amg-webui/types";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";
export type DrawerCloseReason = "close" | "overlay" | "escape" | "programmatic";

export interface DrawerProps extends BaseProps {
  visible?: boolean;
  title?: string;
  placement?: DrawerPlacement;
  width?: string;
  height?: string;
  modal?: boolean;
  closable?: boolean;
  dismissible?: boolean;
  closeOnClickOverlay?: boolean;
  closeOnPressEscape?: boolean;
  lockScroll?: boolean;
  loading?: boolean;
  zIndex?: number;
  teleportTo?: string | HTMLElement;
  ariaLabel?: string;
  beforeClose?: (
    reason: DrawerCloseReason,
    event?: Event,
  ) => boolean | Promise<boolean>;
  trackId?: string;
  telemetry?: boolean;
}

export interface DrawerEmits {
  (e: "update:visible", value: boolean): void;
  (e: "show", event?: Event): void;
  (e: "hide", event?: Event): void;
  (e: "open"): void;
  (e: "closed"): void;
  (e: "close", event?: Event, reason?: DrawerCloseReason): void;
  (e: "error", error: unknown): void;
}
