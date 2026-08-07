import type { BaseProps } from "@amg-webui/types";

export interface ColProps extends BaseProps {
  /** 1–24 column span */
  span?: number;
  /** Offset before this col (0–23) */
  offset?: number;
  push?: number;
  pull?: number;
  /** Grow to fill remaining row space */
  flex?: boolean;
  /** Order within the row */
  order?: number;
  /** Semantic label when used as a standalone layout cell */
  ariaLabel?: string;
  /** Whether to render as a landmark-like container */
  as?: "div" | "article" | "section";
}

export interface ColEmits {
  (e: "click", event: MouseEvent): void;
}
