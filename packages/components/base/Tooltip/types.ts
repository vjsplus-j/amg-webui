import type { BaseProps } from "@amg-webui/types";
import type { FloatingPlacement } from "@amg-webui/utils/domPanel";
export type TooltipPlacement = FloatingPlacement;
export type TooltipTrigger = "hover" | "focus" | "click" | "manual";
export interface TooltipProps extends BaseProps {
  content?: string;
  placement?: TooltipPlacement;
  trigger?: TooltipTrigger | TooltipTrigger[];
  visible?: boolean;
  disabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  /** Backward-compatible alias for openDelay. */ delay?: number;
  offset?: number;
  showArrow?: boolean;
  enterable?: boolean;
  teleportTo?: string;
  maxWidth?: string;
  zIndex?: number;
  popperClass?: string;
}
export interface TooltipEmits {
  (e: "update:visible", value: boolean): void;
  (e: "show", event?: Event): void;
  (
    e: "hide",
    reason: "blur" | "outside" | "escape" | "toggle" | "disabled" | "manual",
    event?: Event,
  ): void;
  (e: "visibleChange", value: boolean): void;
}
