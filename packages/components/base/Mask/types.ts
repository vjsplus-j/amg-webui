import type { BaseProps } from "@amg-webui/types";

export interface MaskProps extends BaseProps {
  visible?: boolean;
  dismissible?: boolean;
  zIndex?: number;
  lockScroll?: boolean;
  trapFocus?: boolean;
  centered?: boolean;
  blur?: boolean;
  teleportTo?: string | HTMLElement;
  ariaLabel?: string;
  closeOnPressEscape?: boolean;
  beforeClose?: (
    reason: MaskCloseReason,
    event?: Event,
  ) => boolean | Promise<boolean>;
  trackId?: string;
  telemetry?: boolean;
}

export type MaskCloseReason = "overlay" | "escape" | "programmatic";

export interface MaskEmits {
  (e: "update:visible", value: boolean): void;
  (e: "close", event?: Event, reason?: MaskCloseReason): void;
  (e: "open"): void;
  (e: "closed"): void;
  (e: "error", error: unknown): void;
}
