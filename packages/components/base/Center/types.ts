import type { BaseProps } from "@amg-webui/types";

export type CenterAxis =
  "both" | "horizontal" | "vertical" | "top" | "bottom" | "left" | "right";

/** Min-height via spacing multiples or fill parent / viewport chrome */
export type CenterMinHeight =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "section"
  | "fill"
  | "viewport";

export interface CenterProps extends BaseProps {
  axis?: CenterAxis;
  /** Stick to edge; when false, inset with `--spacing-lg` on the flush side(s) */
  flush?: boolean;
  /**
   * Minimum height — spacing tokens, `fill` (100%), or `viewport` (100dvh / shell height).
   * Default `none` (content-sized); demos often pass `md`+ or `fill`.
   */
  minHeight?: CenterMinHeight;
  /** Stretch to 100% of parent height (sets height: 100%) */
  fill?: boolean;
  /** Inline / block centering hint on the content wrapper */
  textAlign?: "start" | "center" | "end" | "inherit";
  as?: "div" | "section" | "main";
  contentAs?: "div" | "span";
  ariaLabel?: string;
  maxWidth?: string;
}

export type CenterEmits = Record<string, never>;
