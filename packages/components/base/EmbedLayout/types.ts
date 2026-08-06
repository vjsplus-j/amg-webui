import type { BaseProps } from "@amg-webui/types";

export type EmbedAspect =
  "16/9" | "4/3" | "1/1" | "21/9" | "3/2" | "9/16" | (string & {});
export type EmbedObjectFit = "cover" | "contain" | "fill" | "none";

export interface EmbedLayoutProps extends BaseProps {
  aspectRatio?: EmbedAspect;
  fill?: boolean;
  rounded?: boolean;
  bordered?: boolean;
  objectFit?: EmbedObjectFit;
  label?: string;
  caption?: string;
  loading?: boolean;
  disabled?: boolean;
  interactive?: boolean;
  as?: "div" | "figure" | "section";
}

export interface EmbedLayoutEmits {
  (e: "frame-click", event: MouseEvent | KeyboardEvent): void;
}
