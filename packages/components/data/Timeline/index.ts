import Comp from "./index.vue";
export { Comp as Timeline };
export type {
  TimelineProps,
  TimelineMode,
  TimelineContext,
  TimelineItemProps,
  TimelineItemSide,
  TimelineItemTimestampPlacement,
  TimelineItemColor,
  TimelineKey,
  TimelineEmits,
  TimelineItemEmits,
} from "./types";
export { TIMELINE_INJECTION_KEY } from "./types";
export default Comp;
