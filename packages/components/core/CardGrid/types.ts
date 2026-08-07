export type CardGridMinTrack = "sm" | "md" | "lg";
export type CardGridGap = "sm" | "md" | "lg" | "xl" | "section";
export type CardGridFit = "fill" | "fit";

import type { BaseProps } from "@amg-webui/types";

export interface CardGridProps extends BaseProps {
  /** Fixed column count (1–6). When set, ignores minTrack auto grid. */
  columns?: number;
  /** Min track width for auto-fill / auto-fit mode */
  minTrack?: CardGridMinTrack;
  /** `fill` keeps empty tracks; `fit` collapses empty tracks */
  fit?: CardGridFit;
  gap?: CardGridGap;
  /** Stretch cards to equal row height (default true) */
  equalHeight?: boolean;
  as?: "div" | "section" | "ul" | "ol";
  ariaLabel?: string;
  loading?: boolean;
  skeletonCount?: number;
  empty?: boolean;
  emptyText?: string;
}

export interface CardGridEmits {
  (e: "layout-change", columns: number | null): void;
}
