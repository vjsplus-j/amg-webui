import type { BaseProps, Severity } from "@amg-webui/types";
export interface StatusTipProps extends BaseProps {
  message?: string;
  title?: string;
  severity?: Severity;
  icon?: string | boolean;
  closable?: boolean;
  actionText?: string;
  block?: boolean;
  compact?: boolean;
}
export interface StatusTipEmits {
  (e: "close", event: MouseEvent): void;
  (e: "action", event: MouseEvent): void;
}
