import type { ComputedRef, InjectionKey } from "vue";
import type { BaseProps, Severity } from "@amg-webui/types";
export type TimelineMode = "left" | "right" | "alternate";
export type TimelineKey = string | number;
export type TimelineItemTimestampPlacement = "top" | "bottom";
export type TimelineItemSide = "left" | "right";
export type TimelineItemColor = Severity | (string & {});
export interface TimelineItemProps extends BaseProps {
  itemKey?: TimelineKey;
  title?: string;
  description?: string;
  type?: Severity;
  color?: TimelineItemColor;
  hollow?: boolean;
  label?: string;
  timestamp?: string;
  placement?: TimelineItemTimestampPlacement;
  side?: TimelineItemSide;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  clickable?: boolean;
}
export interface TimelineContext {
  mode: ComputedRef<TimelineMode>;
  activeKey: ComputedRef<TimelineKey | null | undefined>;
  selectable: ComputedRef<boolean>;
  claimIndex: () => number;
  select: (key: TimelineKey, event: MouseEvent | KeyboardEvent) => void;
}
export const TIMELINE_INJECTION_KEY: InjectionKey<TimelineContext> =
  Symbol("vp-timeline");
export interface TimelineProps extends BaseProps {
  items?: TimelineItemProps[];
  mode?: TimelineMode;
  pending?: boolean | string;
  reverse?: boolean;
  modelValue?: TimelineKey | null;
  selectable?: boolean;
}
export interface TimelineEmits {
  (e: "update:modelValue", value: TimelineKey): void;
  (e: "change", value: TimelineKey): void;
  (
    e: "itemClick",
    item: TimelineItemProps | undefined,
    event: MouseEvent | KeyboardEvent,
  ): void;
}
export interface TimelineItemEmits {
  (e: "click", event: MouseEvent | KeyboardEvent): void;
  (e: "select", key: TimelineKey, event: MouseEvent | KeyboardEvent): void;
}
