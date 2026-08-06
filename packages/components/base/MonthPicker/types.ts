import type { BaseProps, DisabledProps } from "@amg-webui/types";

export interface MonthPickerProps extends BaseProps, DisabledProps {
  modelValue?: string | Date | null;
  placeholder?: string;
  valueFormat?: "date" | "iso";
  min?: string | Date;
  max?: string | Date;
  clearable?: boolean;
  readonly?: boolean;
  ariaLabel?: string;
}

export interface MonthPickerEmits {
  (e: "update:modelValue", value: string | Date | null): void;
  (e: "change", value: string | Date | null): void;
  (e: "clear"): void;
  (e: "openChange", open: boolean): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}
