<script setup lang="ts">
import { computed, watch } from "vue";
import type { ColumnLayoutProps, ColumnGap, ColumnAlign } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<ColumnLayoutProps>(), {
  columns: 2,
  gap: "md",
  align: "stretch",
  dense: false,
});

const emit = defineEmits<{
  (e: "columns-change", count: number): void;
}>();

const gapMap: Record<ColumnGap, string> = {
  none: "0",
  xs: "var(--spacing-xs)",
  sm: "var(--spacing-sm)",
  md: "var(--spacing-md)",
  lg: "var(--spacing-lg)",
  xl: "var(--spacing-xl)",
  "2xl": "var(--spacing-2xl)",
  section: "var(--theme-section-gap)",
};

const alignMap: Record<ColumnAlign, string> = {
  start: "start",
  center: "center",
  end: "end",
  stretch: "stretch",
};

const cols = computed(() =>
  Math.min(12, Math.max(1, Math.floor(props.columns ?? 2))),
);

watch(cols, (v) => emit("columns-change", v), { immediate: true });

const rootClass = computed(() => [
  "vp-column-layout",
  `vp-column-layout--cols-${cols.value}`,
  `vp-column-layout--align-${props.align}`,
  {
    "vp-column-layout--dense": props.dense,
  },
  props.class,
]);

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  gap: gapMap[props.gap] ?? gapMap.md,
  gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))`,
  alignItems: alignMap[props.align],
  "--vp-column-gap": gapMap[props.gap] ?? gapMap.md,
  "--vp-column-count": String(cols.value),
}));
</script>

<template>
  <div
    :class="rootClass"
    :style="rootStyle"
    data-component="ColumnLayout"
    role="group"
    :aria-label="label"
  >
    <slot />
  </div>
</template>
