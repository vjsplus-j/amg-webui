<script setup lang="ts">
import { computed, ref } from "vue";
import { trackEmit } from "@amg-webui/telemetry";
import type { RateEmits, RateProps } from "./types";
import "./style.scss";
const props = withDefaults(defineProps<RateProps>(), {
  modelValue: 0,
  max: 5,
  allowHalf: false,
  clearable: false,
  readonly: false,
  size: "md",
  showScore: false,
  texts: () => [],
  telemetry: undefined,
});
const emit = defineEmits<RateEmits>();
const hoverValue = ref<number | null>(null);
const count = computed(() => Math.min(100, Math.max(1, Math.floor(props.max))));
const value = computed(() =>
  Math.min(count.value, Math.max(0, props.modelValue)),
);
const displayValue = computed(() => hoverValue.value ?? value.value);
const interactive = computed(() => !props.disabled && !props.readonly);
function resolve(event: MouseEvent, index: number) {
  if (!props.allowHalf) return index;
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  return event.clientX - rect.left < rect.width / 2 ? index - 0.5 : index;
}
function commit(next: number) {
  if (!interactive.value) return;
  const normalized =
    props.clearable && next === value.value
      ? 0
      : Math.min(count.value, Math.max(0, next));
  emit("update:modelValue", normalized);
  emit("change", normalized);
  trackEmit({
    component: "Rate",
    type: "change",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value: normalized, max: count.value },
  });
}
function hover(event: MouseEvent, index: number) {
  if (!interactive.value) return;
  hoverValue.value = resolve(event, index);
  emit("hoverChange", hoverValue.value);
}
function leave() {
  hoverValue.value = null;
  emit("hoverChange", null);
}
function keydown(event: KeyboardEvent) {
  if (!interactive.value) return;
  const step = props.allowHalf ? 0.5 : 1;
  let next = value.value;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") next += step;
  else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next -= step;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = count.value;
  else if (
    (event.key === "Delete" || event.key === "Backspace") &&
    props.clearable
  )
    next = 0;
  else return;
  event.preventDefault();
  commit(next);
}
const active = (index: number) => displayValue.value >= index;
const half = (index: number) =>
  props.allowHalf &&
  displayValue.value >= index - 0.5 &&
  displayValue.value < index;
const scoreText = computed(
  () => props.texts[Math.ceil(value.value) - 1] ?? String(value.value),
);
</script>
<template>
  <div
    :class="[
      'vp-rate',
      `vp-rate--${size}`,
      { 'vp-rate--disabled': disabled, 'vp-rate--readonly': readonly },
      props.class,
    ]"
    :style="style"
    role="slider"
    :tabindex="disabled ? -1 : 0"
    aria-valuemin="0"
    :aria-valuenow="value"
    :aria-valuemax="count"
    :aria-readonly="readonly"
    :aria-disabled="disabled"
    :aria-label="ariaLabel"
    data-component="Rate"
    @keydown="keydown"
    @mouseleave="leave"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <button
      v-for="index in count"
      :key="index"
      type="button"
      :class="['vp-rate__item', { 'vp-rate__item--active': active(index) }]"
      :disabled="disabled || readonly"
      :tabindex="-1"
      :aria-label="texts[index - 1] ?? `${index}/${count}`"
      @click="commit(resolve($event, index))"
      @mousemove="hover($event, index)"
      @focus="hoverValue = index"
    >
      <slot
        name="icon"
        :index="index"
        :active="active(index)"
        :half="half(index)"
        ><svg class="vp-rate__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          /></svg
        ><span v-if="half(index)" class="vp-rate__half" aria-hidden="true"
          ><svg class="vp-rate__icon" viewBox="0 0 24 24">
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            /></svg></span
      ></slot>
    </button>
    <output v-if="showScore" class="vp-rate__score">{{ scoreText }}</output>
  </div>
</template>
