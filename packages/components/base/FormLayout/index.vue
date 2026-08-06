<script setup lang="ts">
import { computed, watch } from "vue";
import type { FormLayoutProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<FormLayoutProps>(), {
  layout: "horizontal",
  columns: 1,
  colon: false,
  labelWidth: "md",
  gap: "md",
});

const emit = defineEmits<{
  (e: "layout-change", layout: FormLayoutProps["layout"]): void;
}>();

watch(
  () => props.layout,
  (v) => emit("layout-change", v),
  { immediate: true },
);

const labelMap: Record<string, string> = {
  sm: "calc(var(--spacing-2xl) * 2.5)",
  md: "calc(var(--spacing-2xl) * 3.5)",
  lg: "calc(var(--spacing-2xl) * 5)",
  auto: "auto",
};

const gapMap: Record<string, string> = {
  sm: "var(--spacing-sm)",
  md: "var(--spacing-md)",
  lg: "var(--spacing-lg)",
};

const rootClass = computed(() => [
  "vp-form-layout",
  `vp-form-layout--layout-${props.layout}`,
  `vp-form-layout--cols-${props.columns}`,
  `vp-form-layout--label-${props.labelWidth}`,
  {
    "vp-form-layout--colon": props.colon,
  },
  props.class,
]);

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  gap: gapMap[props.gap] ?? gapMap.md,
  "--vp-form-layout-label": labelMap[props.labelWidth] ?? labelMap.md,
  "--vp-form-layout-colon": props.colon ? "':'" : "''",
}));
</script>

<template>
  <div
    :class="rootClass"
    :style="rootStyle"
    data-component="FormLayout"
    role="group"
    aria-orientation="vertical"
  >
    <slot />
  </div>
</template>
