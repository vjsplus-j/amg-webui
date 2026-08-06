import type { BaseProps } from "@amg-webui/types";
import type { FloatingPlacement } from "@amg-webui/utils/domPanel";

export type PopoverTrigger = "click" | "hover" | "focus" | "manual";
export type PopoverCloseReason =
  "toggle" | "outside" | "escape" | "blur" | "programmatic";

export interface PopoverProps extends BaseProps {
  visible?: boolean;
  title?: string;
  placement?: FloatingPlacement;
  trigger?: PopoverTrigger;
  dismissible?: boolean;
  disabled?: boolean;
  offset?: number;
  zIndex?: number;
  openDelay?: number;
  closeDelay?: number;
  showArrow?: boolean;
  focusOnOpen?: boolean;
  teleportTo?: string | HTMLElement;
  ariaLabel?: string;
  trackId?: string;
  telemetry?: boolean;
}

export interface PopoverEmits {
  (e: "update:visible", value: boolean): void;
  (e: "open", event?: Event): void;
  (e: "close", reason: PopoverCloseReason, event?: Event): void;
  (e: "openChange", value: boolean, reason?: PopoverCloseReason): void;
}
