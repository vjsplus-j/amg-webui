import type { BaseProps, DisabledProps } from "@amg-webui/types";

export interface YearPickerProps extends BaseProps, DisabledProps {
  modelValue?: string | Date | number | null;
  id?: string;
  invalid?: boolean;
  placeholder?: string;
  valueFormat?: "number" | "date" | "iso";
  yearRange?: number;
  min?: string | Date | number;
  max?: string | Date | number;
  clearable?: boolean;
  readonly?: boolean;
  ariaLabel?: string;
}

export interface YearPickerEmits {
  (e: "update:modelValue", value: string | Date | number | null): void;
  (e: "change", value: string | Date | number | null): void;
  (e: "clear"): void;
  (e: "openChange", open: boolean): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}
