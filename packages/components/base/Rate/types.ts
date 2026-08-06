import type { BaseProps, DisabledProps } from "@amg-webui/types";
export type RateSize = "sm" | "md" | "lg";
export interface RateProps extends BaseProps, DisabledProps {
  modelValue?: number;
  max?: number;
  allowHalf?: boolean;
  clearable?: boolean;
  readonly?: boolean;
  size?: RateSize;
  showScore?: boolean;
  texts?: string[];
  ariaLabel?: string;
}
export interface RateEmits {
  (e: "update:modelValue", value: number): void;
  (e: "change", value: number): void;
  (e: "hoverChange", value: number | null): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}
