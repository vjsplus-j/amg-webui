import type { BaseProps } from "@amg-webui/types";

export interface ExceptionProps extends BaseProps {
  status?: "403" | "404" | "500" | "offline";
  title?: string;
  description?: string;
  trackId?: string;
  telemetry?: boolean;
  actionText?: string;
  actionDisabled?: boolean;
  ariaLive?: "polite" | "assertive" | "off";
  secondaryActionText?: string;
  showCode?: boolean;
  compact?: boolean;
  loading?: boolean;
}

export interface ExceptionEmits {
  (e: "action", event: MouseEvent): void;
  (e: "secondaryAction", event: MouseEvent): void;
}
