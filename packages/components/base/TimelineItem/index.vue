<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import type { Severity } from "@amg-webui/types";
import { trackEmit } from "@amg-webui/telemetry";
import Icon from "../Icon/index.vue";
import type {
  TimelineItemEmits,
  TimelineItemProps,
  TimelineKey,
} from "../Timeline/types";
import { TIMELINE_INJECTION_KEY } from "../Timeline/types";
import "./style.scss";
const semantic: Severity[] = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
];
const props = withDefaults(defineProps<TimelineItemProps>(), {
  type: "primary",
  hollow: false,
  placement: "bottom",
  disabled: false,
  loading: false,
  clickable: false,
  telemetry: undefined,
});
const emit = defineEmits<TimelineItemEmits>();
const timeline = inject(TIMELINE_INJECTION_KEY, null);
const itemIndex = ref(0);
onMounted(() => {
  if (timeline) itemIndex.value = timeline.claimIndex();
});
const key = computed<TimelineKey>(() => props.itemKey ?? itemIndex.value);
const isSemantic = (value?: string): value is Severity =>
  Boolean(value && semantic.includes(value as Severity));
const resolvedType = computed(() =>
  isSemantic(props.color) ? props.color : props.type,
);
const resolvedSide = computed(
  () =>
    props.side ??
    (timeline?.mode.value === "alternate"
      ? itemIndex.value % 2 === 0
        ? "left"
        : "right"
      : timeline?.mode.value === "right"
        ? "right"
        : "left"),
);
const interactive = computed(
  () =>
    !props.disabled && (props.clickable || Boolean(timeline?.selectable.value)),
);
const active = computed(() => timeline?.activeKey.value === key.value);
const rootClass = computed(() => [
  "vp-timeline-item",
  `vp-timeline-item--placement-${props.placement}`,
  `vp-timeline-item--side-${resolvedSide.value}`,
  {
    "vp-timeline-item--active": active.value,
    "vp-timeline-item--disabled": props.disabled,
    "vp-timeline-item--interactive": interactive.value,
    "vp-timeline-item--loading": props.loading,
  },
  props.class,
]);
function activate(event: MouseEvent | KeyboardEvent) {
  if (!interactive.value) return;
  if (event instanceof KeyboardEvent) event.preventDefault();
  emit("click", event);
  emit("select", key.value, event);
  timeline?.select(key.value, event);
  trackEmit({
    component: "TimelineItem",
    type: "click",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { key: key.value },
  });
}
</script>
<template>
  <li
    :class="rootClass"
    :style="style"
    role="listitem"
    :tabindex="interactive ? 0 : undefined"
    :aria-current="active ? 'step' : undefined"
    :aria-disabled="disabled"
    @click="activate"
    @keydown.enter="activate"
    @keydown.space="activate"
  >
    <div class="vp-timeline-item__axis" aria-hidden="true">
      <slot name="dot"
        ><span
          :class="[
            'vp-timeline-item__dot',
            `vp-timeline-item__dot--${resolvedType}`,
            {
              'vp-timeline-item__dot--hollow': hollow,
              'vp-timeline-item__dot--loading': loading,
            },
          ]"
          :style="
            color && !isSemantic(color)
              ? { '--vp-timeline-color': color }
              : undefined
          "
          ><Icon v-if="icon" :name="icon" size="xs" /></span></slot
      ><span class="vp-timeline-item__tail" />
    </div>
    <div class="vp-timeline-item__content">
      <div v-if="label" class="vp-timeline-item__label">{{ label }}</div>
      <time
        v-if="timestamp && placement === 'top'"
        class="vp-timeline-item__timestamp"
        >{{ timestamp }}</time
      >
      <div class="vp-timeline-item__body">
        <slot
          ><h4 v-if="title" class="vp-timeline-item__title">{{ title }}</h4>
          <p v-if="description" class="vp-timeline-item__description">
            {{ description }}
          </p></slot
        >
      </div>
      <time
        v-if="timestamp && placement === 'bottom'"
        class="vp-timeline-item__timestamp vp-timeline-item__timestamp--bottom"
        >{{ timestamp }}</time
      >
    </div>
  </li>
</template>
