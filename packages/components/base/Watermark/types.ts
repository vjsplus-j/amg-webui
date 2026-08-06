import type { BaseProps } from "@amg-webui/types";

export interface WatermarkFont {
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: "normal" | "italic" | "oblique";
}

export type WatermarkTamperType = "removed" | "style";

export interface WatermarkProps extends BaseProps {
  content?: string | string[];
  image?: string;
  imageCrossOrigin?: "" | "anonymous" | "use-credentials";
  gap?: [number, number];
  offset?: [number, number];
  width?: number;
  height?: number;
  rotate?: number;
  fontSize?: number;
  font?: WatermarkFont;
  opacity?: number;
  zIndex?: number;
  inherit?: boolean;
  observe?: boolean;
  enabled?: boolean;
  ariaLabel?: string;
}

export interface WatermarkEmits {
  (e: "render", dataUrl: string): void;
  (e: "error", error: Error): void;
  (e: "tamper", type: WatermarkTamperType): void;
}
