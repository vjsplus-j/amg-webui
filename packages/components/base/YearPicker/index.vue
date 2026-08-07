<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useLocale, usePopover } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import { toISODate } from "@amg-webui/utils";
import type { YearPickerEmits, YearPickerProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<YearPickerProps>(), {
  modelValue: null,
  valueFormat: "number",
  yearRange: 12,
  clearable: false,
  readonly: false,
  telemetry: undefined,
});
const emit = defineEmits<YearPickerEmits>();
const { t } = useLocale();
const { isOpen, triggerRef, panelRef, toggle, close, open, panelStyle } = usePopover();
function yearOf(value: string | Date | number | null | undefined) {
  if (value == null || value === "") return null;
  if (typeof value === "number")
    return Number.isFinite(value) ? Math.trunc(value) : null;
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value.getFullYear();
  const parsed = Number(String(value).slice(0, 4));
  return Number.isFinite(parsed) ? parsed : null;
}
const selectedYear = computed(() => yearOf(props.modelValue));
const minYear = computed(() => yearOf(props.min));
const maxYear = computed(() => yearOf(props.max));
const rangeSize = computed(() =>
  Math.min(60, Math.max(4, Math.floor(props.yearRange))),
);
const startYear = ref(
  (selectedYear.value ?? new Date().getFullYear()) -
    Math.floor(rangeSize.value / 2),
);
const activeYear = ref(selectedYear.value ?? new Date().getFullYear());
watch(selectedYear, (value) => {
  if (value != null) activeYear.value = value;
});
watch(isOpen, (value) => emit("openChange", value));
const years = computed(() =>
  Array.from(
    { length: rangeSize.value },
    (_, index) => startYear.value + index,
  ),
);
function disabledYear(year: number) {
  return (
    (minYear.value != null && year < minYear.value) ||
    (maxYear.value != null && year > maxYear.value)
  );
}
function choose(year: number) {
  if (props.disabled || props.readonly || disabledYear(year)) return;
  const date = new Date(year, 0, 1);
  const value =
    props.valueFormat === "number"
      ? year
      : props.valueFormat === "date"
        ? date
        : toISODate(date);
  emit("update:modelValue", value);
  emit("change", value);
  close();
  trackEmit({
    component: "YearPicker",
    type: "change",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { year },
  });
}
function clearValue(event: MouseEvent) {
  event.stopPropagation();
  if (props.disabled || props.readonly) return;
  emit("update:modelValue", null);
  emit("change", null);
  emit("clear");
}
function focusActive() {
  panelRef.value
    ?.querySelector<HTMLElement>(`[data-year="${activeYear.value}"]`)
    ?.focus();
}
function ensureVisible(year: number) {
  if (year < startYear.value || year >= startYear.value + rangeSize.value) {
    startYear.value = year - Math.floor(rangeSize.value / 2);
  }
}
function togglePanel() {
  if (!props.disabled && !props.readonly) toggle();
}
function triggerKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    open();
    void nextTick(focusActive);
  }
}
function gridKeydown(event: KeyboardEvent, year: number) {
  let next = year;
  if (event.key === "ArrowLeft") next--;
  else if (event.key === "ArrowRight") next++;
  else if (event.key === "ArrowUp") next -= 3;
  else if (event.key === "ArrowDown") next += 3;
  else if (event.key === "Home") next = years.value[0];
  else if (event.key === "End") next = years.value.at(-1) ?? year;
  else if (event.key === "PageUp") next -= rangeSize.value;
  else if (event.key === "PageDown") next += rangeSize.value;
  else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    choose(year);
    return;
  } else return;
  event.preventDefault();
  activeYear.value = next;
  ensureVisible(next);
  void nextTick(focusActive);
}
</script>

<template>
  <div
    :class="['vp-yearpicker', props.class]"
    :style="style"
    data-component="YearPicker"
  >
    <button
      ref="triggerRef"
      type="button"
      class="vp-yearpicker__trigger"
      :disabled="disabled"
      :aria-label="ariaLabel ?? placeholder"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      @click="togglePanel"
      @keydown="triggerKeydown"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    >
      <span
        :class="[
          'vp-yearpicker__label',
          { 'vp-yearpicker__label--placeholder': modelValue == null },
        ]"
      >
        {{ modelValue == null ? placeholder : selectedYear }} </span
      ><span aria-hidden="true">⌄</span>
    </button>
    <button
      v-if="clearable && modelValue != null"
      type="button"
      class="vp-yearpicker__clear"
      :disabled="disabled || readonly"
      :aria-label="t('button.reset')"
      @click="clearValue"
    >
      ×
    </button>
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="panelRef"
        class="vp-yearpicker__panel"
        role="dialog"
        :aria-label="ariaLabel ?? placeholder"
        :style="panelStyle"
      >
        <div class="vp-yearpicker__header">
          <strong>{{ years[0] }} – {{ years.at(-1) }}</strong>
          <div class="vp-yearpicker__nav">
            <button
              type="button"
              :disabled="minYear != null && years[0] <= minYear"
              @click="startYear -= rangeSize"
            >
              ‹
            </button>
            <button
              type="button"
              :disabled="maxYear != null && (years.at(-1) ?? 0) >= maxYear"
              @click="startYear += rangeSize"
            >
              ›
            </button>
          </div>
        </div>
        <div class="vp-yearpicker__grid" role="grid">
          <button
            v-for="year in years"
            :key="year"
            type="button"
            :data-year="year"
            :class="[
              'vp-yearpicker__year',
              { 'vp-yearpicker__year--selected': selectedYear === year },
            ]"
            :disabled="disabledYear(year)"
            :tabindex="year === activeYear ? 0 : -1"
            role="gridcell"
            :aria-selected="selectedYear === year"
            @focus="activeYear = year"
            @click="choose(year)"
            @keydown="gridKeydown($event, year)"
          >
            {{ year }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
