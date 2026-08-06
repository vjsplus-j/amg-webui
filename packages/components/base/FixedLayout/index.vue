<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import type {
  FixedLayoutEmits,
  FixedLayoutProps,
  FixedLayoutSize,
} from "./types";
import "./style.scss";

const props = withDefaults(defineProps<FixedLayoutProps>(), {
  mode: "fixed",
  position: "top",
  offset: "none",
  placeholder: true,
  safeArea: false,
  as: "div",
});
const emit = defineEmits<FixedLayoutEmits>();

const offsetMap = {
  none: "0px",
  sm: "var(--spacing-sm)",
  md: "var(--spacing-md)",
  lg: "var(--spacing-lg)",
} as const;
const barRef = ref<HTMLElement | null>(null);
const barSize = ref<FixedLayoutSize>({ width: 0, height: 0 });
let resizeObserver: ResizeObserver | null = null;

function measure() {
  const rect = barRef.value?.getBoundingClientRect();
  if (!rect) return;
  const next = { width: Math.ceil(rect.width), height: Math.ceil(rect.height) };
  if (
    next.width === barSize.value.width &&
    next.height === barSize.value.height
  )
    return;
  barSize.value = next;
  emit("resize", next);
}
function observe() {
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (!barRef.value) return;
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(barRef.value);
  }
  measure();
}

onMounted(() => void nextTick(observe));
onBeforeUnmount(() => resizeObserver?.disconnect());
watch(
  () => [
    props.position,
    props.offset,
    props.mode,
    props.placeholder,
    props.teleportTo,
  ],
  () => void nextTick(observe),
);

const axis = computed(() =>
  props.position === "top" || props.position === "bottom" ? "block" : "inline",
);
const inset = computed(() => {
  const offset = offsetMap[props.offset];
  if (!props.safeArea) return offset;
  return `calc(${offset} + env(safe-area-inset-${props.position}))`;
});
const barStyle = computed(() => {
  const value: Record<string, string | number> = {
    ...(props.style ?? {}),
    position: props.mode,
    [props.position]: inset.value,
  };
  if (props.zIndex != null) value.zIndex = props.zIndex;
  if (axis.value === "block") {
    value.left = "0";
    value.right = "0";
  } else {
    value.top = "0";
    value.bottom = "0";
  }
  return value;
});
const placeholderBefore = computed(
  () =>
    props.placeholder &&
    (props.position === "top" || props.position === "left"),
);
const placeholderAfter = computed(
  () =>
    props.placeholder &&
    (props.position === "bottom" || props.position === "right"),
);
const placeholderStyle = computed(() => {
  const measured =
    axis.value === "block" ? barSize.value.height : barSize.value.width;
  const size = measured ? `calc(${inset.value} + ${measured}px)` : inset.value;
  return axis.value === "block"
    ? { height: size, width: "100%" }
    : { width: size };
});
</script>

<template>
  <div
    v-if="placeholderBefore"
    class="vp-fixed-layout__placeholder"
    :style="placeholderStyle"
    aria-hidden="true"
  />
  <Teleport :to="teleportTo ?? 'body'" :disabled="!teleportTo">
    <component
      :is="as"
      ref="barRef"
      :class="[
        'vp-fixed-layout',
        `vp-fixed-layout--${mode}`,
        `vp-fixed-layout--${position}`,
        props.class,
      ]"
      :style="barStyle"
      :role="role"
      :aria-label="ariaLabel"
      data-component="FixedLayout"
    >
      <slot :size="barSize" />
    </component>
  </Teleport>
  <div
    v-if="placeholderAfter"
    class="vp-fixed-layout__placeholder"
    :style="placeholderStyle"
    aria-hidden="true"
  />
</template>
