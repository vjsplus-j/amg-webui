import type { BaseProps } from "@amg-webui/types";

export interface DescriptionsItemProps extends BaseProps {
  label?: string;
  span?: number;
  colon?: boolean;
  labelAlign?: "start" | "end";
  labelWidth?: string | number;
}
