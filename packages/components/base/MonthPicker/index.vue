<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useLocale, usePopover } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import {
  formatWithIntl,
  getMonthLabels,
  parseISODate,
  toISODate,
} from "@amg-webui/utils";
import type { MonthPickerEmits, MonthPickerProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<MonthPickerProps>(), {
  modelValue: null,
  valueFormat: "iso",
  clearable: false,
  readonly: false,
  telemetry: undefined,
});
const emit = defineEmits<MonthPickerEmits>();
const { locale, t } = useLocale();
const { isOpen, triggerRef, panelRef, toggle, close, open, panelStyle } = usePopover();
function parse(value: string | Date | null | undefined) {
  if (!value) return null;
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;
  return parseISODate(String(value));
}
const selectedDate = computed(() => parse(props.modelValue));
const minDate = computed(() => parse(props.min));
const maxDate = computed(() => parse(props.max));
const viewYear = ref(
  selectedDate.value?.getFullYear() ?? new Date().getFullYear(),
);
const activeMonth = ref(
  selectedDate.value?.getMonth() ?? new Date().getMonth(),
);
watch(selectedDate, (value) => {
  if (!value) return;
  viewYear.value = value.getFullYear();
  activeMonth.value = value.getMonth();
});
watch(isOpen, (value) => emit("openChange", value));
const labels = computed(() => {
  void locale.value;
  return getMonthLabels(viewYear.value);
});
const displayLabel = computed(() => {
  if (!selectedDate.value) return "";
  void locale.value;
  return formatWithIntl(selectedDate.value, { year: "numeric", month: "long" });
});
function monthValue(year: number, month: number) {
  return year * 12 + month;
}
function monthDisabled(month: number) {
  const value = monthValue(viewYear.value, month);
  const minimum = minDate.value
    ? monthValue(minDate.value.getFullYear(), minDate.value.getMonth())
    : -Infinity;
  const maximum = maxDate.value
    ? monthValue(maxDate.value.getFullYear(), maxDate.value.getMonth())
    : Infinity;
  return value < minimum || value > maximum;
}
function choose(month: number) {
  if (props.disabled || props.readonly || monthDisabled(month)) return;
  const date = new Date(viewYear.value, month, 1);
  const value = props.valueFormat === "date" ? date : toISODate(date);
  emit("update:modelValue", value);
  emit("change", value);
  close();
  trackEmit({
    component: "MonthPicker",
    type: "change",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value: toISODate(date) },
  });
}
function clearValue(event: MouseEvent) {
  event.stopPropagation();
  if (props.disabled || props.readonly) return;
  emit("update:modelValue", null);
  emit("change", null);
  emit("clear");
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
function focusActive() {
  panelRef.value
    ?.querySelector<HTMLElement>(`[data-month="${activeMonth.value}"]`)
    ?.focus();
}
function gridKeydown(event: KeyboardEvent, month: number) {
  let next = month;
  if (event.key === "ArrowLeft") next--;
  else if (event.key === "ArrowRight") next++;
  else if (event.key === "ArrowUp") next -= 3;
  else if (event.key === "ArrowDown") next += 3;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = 11;
  else if (event.key === "PageUp") {
    viewYear.value--;
    next = month;
  } else if (event.key === "PageDown") {
    viewYear.value++;
    next = month;
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    choose(month);
    return;
  } else return;
  event.preventDefault();
  if (next < 0) {
    viewYear.value--;
    next += 12;
  }
  if (next > 11) {
    viewYear.value++;
    next -= 12;
  }
  activeMonth.value = next;
  void nextTick(focusActive);
}
</script>

<template>
  <div
    :class="['vp-monthpicker', props.class]"
    :style="style"
    data-component="MonthPicker"
  >
    <button
      ref="triggerRef"
      type="button"
      class="vp-monthpicker__trigger"
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
          'vp-monthpicker__label',
          { 'vp-monthpicker__label--placeholder': !modelValue },
        ]"
      >
        {{ modelValue ? displayLabel : placeholder }}
      </span>
      <span aria-hidden="true">⌄</span>
    </button>
    <button
      v-if="clearable && modelValue != null"
      type="button"
      class="vp-monthpicker__clear"
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
        class="vp-monthpicker__panel"
        role="dialog"
        :aria-label="ariaLabel ?? placeholder"
        :style="panelStyle"
      >
        <div class="vp-monthpicker__header">
          <strong>{{ viewYear }}</strong>
          <div class="vp-monthpicker__nav">
            <button
              type="button"
              :aria-label="String(viewYear - 1)"
              @click="viewYear--"
            >
              ‹
            </button>
            <button
              type="button"
              :aria-label="String(viewYear + 1)"
              @click="viewYear++"
            >
              ›
            </button>
          </div>
        </div>
        <div class="vp-monthpicker__grid" role="grid">
          <button
            v-for="(label, month) in labels"
            :key="month"
            type="button"
            :data-month="month"
            :class="[
              'vp-monthpicker__month',
              {
                'vp-monthpicker__month--selected':
                  selectedDate?.getFullYear() === viewYear &&
                  selectedDate?.getMonth() === month,
              },
            ]"
            :disabled="monthDisabled(month)"
            :tabindex="month === activeMonth ? 0 : -1"
            role="gridcell"
            :aria-selected="
              selectedDate?.getFullYear() === viewYear &&
              selectedDate?.getMonth() === month
            "
            @focus="activeMonth = month"
            @click="choose(month)"
            @keydown="gridKeydown($event, month)"
          >
            {{ label }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
