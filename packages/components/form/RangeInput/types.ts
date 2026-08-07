import type { BaseProps, DisabledProps } from "@amg-webui/types";

export interface RangeValue {
  min?: number | null;
  max?: number | null;
}

export interface RangeInputProps extends BaseProps, DisabledProps {
  modelValue?: RangeValue;
  id?: string;
  precision?: number;
  step?: number;
  min?: number;
  max?: number;
  allowCross?: boolean;
  invalid?: boolean;
  startPlaceholder?: string;
  endPlaceholder?: string;
  ariaLabel?: string;
}

export interface RangeInputEmits {
  (e: "update:modelValue", value: RangeValue): void;
  (e: "change", value: RangeValue): void;
}
