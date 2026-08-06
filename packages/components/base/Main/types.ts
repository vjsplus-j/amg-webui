import type { BaseProps } from "@amg-webui/types";

export type MainPadding =
  "none" | "xs" | "sm" | "md" | "lg" | "xl" | "page" | "card";

export interface MainProps extends BaseProps {
  /** Legacy boolean — true → page pad; ignored when `padding` is set */
  padded?: boolean;
  /** Padding via spacing / theme tokens */
  padding?: MainPadding;
  label?: string;
  overflow?: "auto" | "hidden" | "visible";
  /** Fill remaining flex height in a Layout column */
  fill?: boolean;
}

export interface MainEmits {
  (e: "scroll", event: Event): void;
}
