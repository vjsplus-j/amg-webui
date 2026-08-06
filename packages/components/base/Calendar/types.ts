import type { BaseProps } from "@amg-webui/types";

export type CalendarValue = string | Date | null;
export interface CalendarProps extends BaseProps {
  modelValue?: CalendarValue;
  valueFormat?: "date" | "iso";
  viewDate?: CalendarValue;
  min?: CalendarValue;
  max?: CalendarValue;
  disabledDate?: (date: Date) => boolean;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showAdjacent?: boolean;
  showToday?: boolean;
  disabled?: boolean;
}
export interface CalendarEmits {
  (e: "update:modelValue", value: CalendarValue): void;
  (e: "update:viewDate", value: Date): void;
  (e: "select", value: string | Date): void;
  (e: "change", value: CalendarValue): void;
  (e: "monthChange", value: Date): void;
}
