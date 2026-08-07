<script setup lang="ts">
import { inject, computed } from "vue";
import { DESCRIPTIONS_INJECTION_KEY } from "../Descriptions/types";
import "./style.scss";

let uidSeq = 0;

const props = withDefaults(
  defineProps<{
    label?: string;
    span?: number;
    /** Append colon after label */
    colon?: boolean;
    labelAlign?: "start" | "end";
    /** Override parent Descriptions labelWidth */
    labelWidth?: string | number;
    class?: string;
    style?: Record<string, string>;
  }>(),
  {
    span: 1,
    colon: false,
    labelAlign: "start",
  },
);

const ctx = inject(DESCRIPTIONS_INJECTION_KEY, null);
const labelId = `vp-desc-item-label-${++uidSeq}`;

const labelWidthStyle = computed(() => {
  const raw = props.labelWidth ?? ctx?.labelWidth.value;
  if (raw == null) return undefined;
  if (typeof raw === "number") {
    return { width: `calc(var(--spacing-xs) * ${raw})`, flexShrink: "0" };
  }
  return { width: raw, flexShrink: "0" };
});

const itemStyle = computed(() => ({
  ...(props.style ?? {}),
  gridColumn: `span ${Math.min(props.span, ctx?.column.value ?? props.span)}`,
}));

const labelClass = computed(() => [
  "vp-descriptions-item__label",
  `vp-descriptions-item__label--align-${props.labelAlign}`,
  { "vp-descriptions-item__label--colon": props.colon },
]);

</script>

<template>
  <div
    :class="['vp-descriptions-item', props.class]"
    :style="itemStyle"
    role="group"
    :aria-labelledby="label || $slots.label ? labelId : undefined"
    data-component="DescriptionsItem">
    <div
      v-if="label || $slots.label"
      :id="labelId"
      :class="labelClass"
      :style="labelWidthStyle"
    >
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="vp-descriptions-item__content">
      <slot />
    </div>
  </div>
</template>
