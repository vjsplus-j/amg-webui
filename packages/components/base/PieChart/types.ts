import type { BaseProps } from "@amg-webui/types";

export type PieChartKey = string | number;
export interface PieChartDatum {
  key?: PieChartKey;
  label: string;
  value: number;
  color?: string;
  disabled?: boolean;
  data?: unknown;
}
export interface PieChartProps extends BaseProps {
  title?: string;
  description?: string;
  data?: PieChartDatum[] | number[];
  modelValue?: PieChartKey | null;
  selectionValue?: "key" | "value";
  disabled?: boolean;
  loading?: boolean;
  radius?: number;
  innerRadius?: number;
  startAngle?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  showPercent?: boolean;
  emptyText?: string;
  valueFormatter?: (value: number, datum: PieChartDatum) => string;
  ariaLabel?: string;
}
export interface PieChartEmits {
  (e: "update:modelValue", value: PieChartKey): void;
  (e: "change", value: PieChartKey, datum: PieChartDatum, index: number): void;
  (e: "click", event: MouseEvent | KeyboardEvent): void;
  (
    e: "sliceClick",
    datum: PieChartDatum,
    index: number,
    event: MouseEvent | KeyboardEvent,
  ): void;
  (
    e: "legendClick",
    datum: PieChartDatum,
    index: number,
    event: MouseEvent | KeyboardEvent,
  ): void;
}
