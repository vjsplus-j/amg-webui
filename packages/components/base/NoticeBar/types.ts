import type { BaseProps, Severity } from "@amg-webui/types";
export interface NoticeBarProps extends BaseProps {
  modelValue?: boolean;
  message?: string;
  title?: string;
  severity?: Severity;
  icon?: string | boolean;
  closable?: boolean;
  scrollable?: boolean;
  speed?: number;
  pauseOnHover?: boolean;
  wrap?: boolean;
  actionText?: string;
}
export interface NoticeBarEmits {
  (e: "update:modelValue", value: boolean): void;
  (e: "close", event: MouseEvent): void;
  (e: "click", event: MouseEvent): void;
  (e: "action", event: MouseEvent): void;
}
