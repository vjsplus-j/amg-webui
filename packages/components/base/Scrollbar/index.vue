<script setup lang="ts">
import { computed, ref } from "vue";
import { trackEmit } from "@amg-webui/telemetry";
import type { ScrollbarEmits, ScrollbarProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<ScrollbarProps>(), {
  native: false,
  axis: "both",
  tabindex: 0,
  endThreshold: 1,
  telemetry: undefined,
});

const emit = defineEmits<ScrollbarEmits>();

const wrapRef = ref<HTMLElement | null>(null);
let atStart = false;
let atEnd = false;

function toCssSize(val?: string | number): string | undefined {
  if (val == null) return undefined;
  if (typeof val === "number") {
    return `calc(var(--spacing-xs) * ${Math.max(0, val)})`;
  }
  return val;
}

const wrapStyle = computed(() => ({
  ...(props.style ?? {}),
  height: toCssSize(props.height),
  maxHeight: toCssSize(props.maxHeight),
}));

function onScroll(event: Event) {
  trackEmit({
    component: "Scrollbar",
    type: "scroll",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
  emit("scroll", event);
  const el = event.currentTarget as HTMLElement;
  const position = { top: el.scrollTop, left: el.scrollLeft };
  const nextStart =
    el.scrollTop <= props.endThreshold && el.scrollLeft <= props.endThreshold;
  const nextEnd =
    el.scrollTop + el.clientHeight >= el.scrollHeight - props.endThreshold ||
    el.scrollLeft + el.clientWidth >= el.scrollWidth - props.endThreshold;
  if (nextStart && !atStart) emit("reach-start", position);
  if (nextEnd && !atEnd) emit("reach-end", position);
  atStart = nextStart;
  atEnd = nextEnd;
}

function scrollTo(options: ScrollToOptions | number, y?: number) {
  const el = wrapRef.value;
  if (!el) return;
  if (typeof options === "number") {
    el.scrollTo(options, y ?? 0);
  } else {
    el.scrollTo(options);
  }
}

function scrollBy(options: ScrollToOptions | number, y?: number) {
  const el = wrapRef.value;
  if (!el) return;
  if (typeof options === "number") el.scrollBy(options, y ?? 0);
  else el.scrollBy(options);
}

function setScrollTop(value: number) {
  if (wrapRef.value) wrapRef.value.scrollTop = Math.max(0, value);
}

function setScrollLeft(value: number) {
  if (wrapRef.value) wrapRef.value.scrollLeft = Math.max(0, value);
}

defineExpose({ scrollTo, scrollBy, setScrollTop, setScrollLeft, wrapRef });
</script>

<template>
  <div
    ref="wrapRef"
    :class="[
      'vp-scrollbar',
      { 'vp-scrollbar--native': native },
      `vp-scrollbar--axis-${axis}`,
      props.class,
    ]"
    :style="wrapStyle"
    :tabindex="tabindex"
    :aria-label="ariaLabel"
    data-component="Scrollbar"
    @scroll="onScroll"
  >
    <div class="vp-scrollbar__view">
      <slot />
    </div>
  </div>
</template>
