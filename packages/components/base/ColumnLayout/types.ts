export type ColumnGap =
  "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "section";
export type ColumnAlign = "start" | "center" | "end" | "stretch";

export interface ColumnLayoutProps {
  columns?: number;
  gap?: ColumnGap;
  align?: ColumnAlign;
  dense?: boolean;
  /** Accessible label for the column group */
  label?: string;
  class?: string;
  style?: Record<string, string>;
}

export interface ColumnLayoutEmits {
  (e: "columns-change", count: number): void;
}
