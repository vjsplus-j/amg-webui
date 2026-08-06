import type { BaseProps } from "@amg-webui/types";

export interface ScrollbarProps extends BaseProps {
  /** CSS length or spacing-step number (× --spacing-xs) */
  height?: string | number;
  maxHeight?: string | number;
  /** Use browser native scrollbar chrome */
  native?: boolean;
  trackId?: string;
  telemetry?: boolean;
  axis?: "both" | "x" | "y";
  tabindex?: number;
  ariaLabel?: string;
  endThreshold?: number;
}

export interface ScrollbarEmits {
  (e: "scroll", event: Event): void;
  (e: "reach-start", position: { top: number; left: number }): void;
  (e: "reach-end", position: { top: number; left: number }): void;
}
