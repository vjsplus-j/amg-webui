import type { BaseProps, Severity } from "@amg-webui/types";
export interface ScrollNoticeProps extends BaseProps {
  title?: string;
  text?: string;
  data?: string;
  severity?: Severity;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  paused?: boolean;
  disabled?: boolean;
  loading?: boolean;
  closable?: boolean;
}
export interface ScrollNoticeEmits {
  (e: "update:paused", value: boolean): void;
  (e: "pause"): void;
  (e: "resume"): void;
  (e: "close", event: MouseEvent): void;
  (e: "click", event: MouseEvent): void;
}
