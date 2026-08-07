import type { BaseProps } from "@amg-webui/types";
import type { InjectionKey, ComputedRef } from "vue";

export type RowAlign = "start" | "end" | "center" | "stretch" | "baseline";
export type RowJustify =
  | "start"
  | "end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";

/** Spacing token keys or raw CSS length / number (× `--spacing-xs`) */
export type RowGutter =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "section"
  | string
  | number;

export const ROW_GUTTER_KEY: InjectionKey<ComputedRef<string>> =
  Symbol("vp-row-gutter");

export interface RowProps extends BaseProps {
  /** Gap between cols — token key, CSS length, or number × `--spacing-xs`. Default: md */
  gutter?: RowGutter;
  wrap?: boolean;
  align?: RowAlign;
  justify?: RowJustify;
}
