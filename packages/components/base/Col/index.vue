<script setup lang="ts">
import { computed } from "vue";
import "./style.scss";

const props = withDefaults(
  defineProps<{
    span?: number;
    offset?: number;
    push?: number;
    pull?: number;
    flex?: boolean;
    order?: number;
    class?: string;
    style?: Record<string, string>;
    ariaLabel?: string;
    as?: "div" | "article" | "section";
  }>(),
  {
    span: undefined,
    offset: 0,
    push: 0,
    pull: 0,
    flex: false,
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

function clamp(n: number | undefined, min: number, max: number) {
  if (n == null) return null;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

const spanClamped = computed(() => clamp(props.span, 1, 24));

const rootClass = computed(() => [
  "vp-col",
  {
    [`vp-col--span-${spanClamped.value ?? "auto"}`]: props.span != null,
    "vp-col--flex": props.flex || props.span == null,
    "vp-col--offset": (clamp(props.offset, 0, 23) ?? 0) > 0,
  },
  props.class,
]);
const rootTag = computed(() => props.as ?? "div");

const rootStyle = computed(() => {
  const span = spanClamped.value;
  const offset = clamp(props.offset, 0, 23) ?? 0;
  const push = clamp(props.push, 0, 23) ?? 0;
  const pull = clamp(props.pull, 0, 23) ?? 0;
  const s: Record<string, string> = { ...(props.style ?? {}) };
  if (span != null) {
    const pct = `calc(100% * ${span} / 24)`;
    s.flex = `0 0 ${pct}`;
    s.maxWidth = pct;
    s["--vp-col-span"] = String(span);
  } else if (props.flex) {
    s.flex = "1 1 0%";
    s.maxWidth = "100%";
  } else {
    s.flex = "1 1 0%";
    s.maxWidth = "100%";
  }
  if (offset > 0) {
    s.marginInlineStart = `calc(100% * ${offset} / 24)`;
    s["--vp-col-offset"] = String(offset);
  }
  if (push > 0) s.insetInlineStart = `calc(100% * ${push} / 24)`;
  if (pull > 0) s.insetInlineEnd = `calc(100% * ${pull} / 24)`;
  if (push > 0 || pull > 0) s.position = "relative";
  if (props.order != null) s.order = String(props.order);
  return s;
});
</script>

<template>
  <component
    :is="rootTag"
    :class="rootClass"
    :style="rootStyle"
    data-component="Col"
    :role="ariaLabel ? 'group' : 'cell'"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <slot></slot>
  </component>
</template>
