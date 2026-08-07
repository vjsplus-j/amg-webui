import type { BaseProps, Severity } from "@amg-webui/types";

export type DataCardValue = string | number | null | undefined;
export type DataCardTrend = "up" | "down" | "flat";

export interface DataCardProps extends BaseProps {
  title?: string;
  description?: string;
  value?: DataCardValue;
  /** Backward-compatible value alias. */
  data?: DataCardValue;
  prefix?: string;
  suffix?: string;
  formatter?: (value: DataCardValue) => string;
  trend?: number;
  trendType?: DataCardTrend;
  trendLabel?: string;
  status?: Severity;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  clickable?: boolean;
  selected?: boolean;
  progress?: number;
}

export interface DataCardEmits {
  (e: "update:selected", value: boolean): void;
  (e: "change", value: boolean): void;
  (e: "click", event: MouseEvent): void;
}
