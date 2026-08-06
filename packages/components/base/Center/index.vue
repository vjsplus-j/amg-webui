<script setup lang="ts">
import { computed } from "vue";
import type { CenterMinHeight, CenterProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<CenterProps>(), {
  axis: "both",
  flush: true,
  minHeight: "none",
  fill: false,
  textAlign: "inherit",
  as: "div",
  contentAs: "div",
});

const minHeightVar: Record<CenterMinHeight, string> = {
  none: "0",
  xs: "var(--spacing-xs)",
  sm: "calc(var(--spacing-2xl) * 2)",
  md: "calc(var(--spacing-2xl) * 4)",
  lg: "calc(var(--spacing-2xl) * 6)",
  xl: "calc(var(--spacing-2xl) * 8)",
  "2xl": "calc(var(--spacing-2xl) * 10)",
  section: "calc(var(--theme-section-gap) * 8)",
  fill: "100%",
  viewport: "100dvh",
};

const rootClass = computed(() => [
  "vp-center",
  `vp-center--${props.axis}`,
  `vp-center--min-${props.minHeight}`,
  {
    "vp-center--inset": props.flush === false,
    "vp-center--fill": props.fill,
  },
  props.class,
]);

const contentClass = computed(() => [
  "vp-center__content",
  `vp-center__content--${props.axis}`,
  {
    [`vp-center__content--text-${props.textAlign}`]:
      props.textAlign !== "inherit",
  },
]);

const rootStyle = computed(() => {
  const s: Record<string, string> = { ...(props.style ?? {}) };
  if (props.minHeight !== "none") {
    s.minHeight = minHeightVar[props.minHeight] ?? "0";
  }
  if (props.fill) {
    s.height = "100%";
  }
  if (props.maxWidth) s.maxWidth = props.maxWidth;
  return s;
});
</script>

<template>
  <component
    :is="as"
    :class="rootClass"
    :style="rootStyle"
    data-component="Center"
    :role="ariaLabel ? 'group' : undefined"
    :aria-label="ariaLabel"
  >
    <component :is="contentAs" :class="contentClass">
      <slot></slot>
    </component>
  </component>
</template>
