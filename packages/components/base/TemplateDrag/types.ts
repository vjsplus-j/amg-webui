import type { BaseProps } from "@amg-webui/types";

export interface TemplateDragItem {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  data?: unknown;
}

export interface TemplateDragProps extends BaseProps {
  templates?: TemplateDragItem[];
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  telemetry?: boolean;
  trackId?: string;
}

export interface TemplateDragEmits {
  (e: "apply", tpl: TemplateDragItem): void;
  (e: "dragStart", tpl: TemplateDragItem, event: DragEvent): void;
  (e: "dragEnd", tpl: TemplateDragItem, event: DragEvent): void;
  (e: "refresh"): void;
}
