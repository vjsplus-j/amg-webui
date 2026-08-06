import type { BaseProps } from "@amg-webui/types";

export type FlowGap =
  "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "section";
export type FlowAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FlowJustify =
  | "start"
  | "center"
  | "end"
  | "space-between"
  | "space-around"
  | "space-evenly";

export interface FlowLayoutProps extends BaseProps {
  gap?: FlowGap;
  /** Row gap — defaults to `gap` when omitted */
  rowGap?: FlowGap;
  /** Column gap — defaults to `gap` when omitted */
  columnGap?: FlowGap;
  align?: FlowAlign;
  justify?: FlowJustify;
  /** Reverse wrap direction */
  reverse?: boolean;
  wrap?: boolean;
  as?: "div" | "section" | "ul" | "ol";
  ariaLabel?: string;
}

export type FlowLayoutEmits = Record<string, never>;
