import type { BaseProps } from "@amg-webui/types";

export type FixedLayoutPosition = "top" | "bottom" | "left" | "right";
export type FixedLayoutSize = { width: number; height: number };

export interface FixedLayoutProps extends BaseProps {
  mode?: "fixed" | "absolute";
  position?: FixedLayoutPosition;
  offset?: "none" | "sm" | "md" | "lg";
  zIndex?: number;
  placeholder?: boolean;
  safeArea?: boolean;
  as?: "div" | "header" | "footer" | "aside" | "nav";
  role?: string;
  ariaLabel?: string;
  teleportTo?: string | HTMLElement;
}

export interface FixedLayoutEmits {
  (e: "resize", size: FixedLayoutSize): void;
}
