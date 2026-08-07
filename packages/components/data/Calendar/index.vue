<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import {
  getMonthYearLabel,
  getWeekdayLabels,
  parseISODate,
  sameDate,
  toISODate,
} from "@amg-webui/utils";
import Icon from "@amg-webui/core/Icon/index.vue";
import type { CalendarEmits, CalendarProps, CalendarValue } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<CalendarProps>(), {
  modelValue: null,
  valueFormat: "iso",
  firstDayOfWeek: 0,
  showAdjacent: true,
  showToday: true,
  disabled: false,
  telemetry: undefined,
});
const emit = defineEmits<CalendarEmits>();
const { locale, t } = useLocale();
const titleId = `${useId()}-title`;
const rootRef = ref<HTMLElement | null>(null);
const today = new Date();
const asDate = (value?: CalendarValue) =>
  value instanceof Date
    ? new Date(value)
    : value
      ? parseISODate(String(value))
      : null;
const selectedDate = computed(() => asDate(props.modelValue));
const initial = asDate(props.viewDate) ?? selectedDate.value ?? today;
const internalView = ref(
  new Date(initial.getFullYear(), initial.getMonth(), 1),
);
const focusedDate = ref(new Date(selectedDate.value ?? today));

watch(
  () => props.viewDate,
  (value) => {
    const date = asDate(value);
    if (date)
      internalView.value = new Date(date.getFullYear(), date.getMonth(), 1);
  },
);
watch(selectedDate, (value) => {
  if (value) focusedDate.value = new Date(value);
});
const weekdays = computed(() => {
  const labels = getWeekdayLabels(locale.value);
  return [
    ...labels.slice(props.firstDayOfWeek),
    ...labels.slice(0, props.firstDayOfWeek),
  ];
});
const monthLabel = computed(() =>
  getMonthYearLabel(internalView.value, locale.value),
);
const cells = computed(() => {
  const first = new Date(
    internalView.value.getFullYear(),
    internalView.value.getMonth(),
    1,
  );
  const offset = (first.getDay() - props.firstDayOfWeek + 7) % 7;
  const start = new Date(first);
  start.setDate(1 - offset);
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });
});
const weeks = computed(() => {
  const out: Date[][] = [];
  for (let i = 0; i < cells.value.length; i += 7) {
    out.push(cells.value.slice(i, i + 7));
  }
  return out;
});
const minDate = computed(() => asDate(props.min));
const maxDate = computed(() => asDate(props.max));
const isDisabled = (date: Date) =>
  props.disabled ||
  Boolean(minDate.value && date < minDate.value) ||
  Boolean(maxDate.value && date > maxDate.value) ||
  Boolean(props.disabledDate?.(new Date(date)));
const toValue = (date: Date): string | Date =>
  props.valueFormat === "date" ? new Date(date) : toISODate(date);

function setView(date: Date) {
  internalView.value = new Date(date.getFullYear(), date.getMonth(), 1);
  emit("update:viewDate", new Date(internalView.value));
  emit("monthChange", new Date(internalView.value));
  trackEmit({
    component: "Calendar",
    type: "monthChange",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { month: toISODate(internalView.value) },
  });
}
function moveMonth(amount: number) {
  setView(
    new Date(
      internalView.value.getFullYear(),
      internalView.value.getMonth() + amount,
      1,
    ),
  );
}
function select(date: Date) {
  if (isDisabled(date)) return;
  const value = toValue(date);
  focusedDate.value = new Date(date);
  if (date.getMonth() !== internalView.value.getMonth()) setView(date);
  emit("update:modelValue", value);
  emit("select", value);
  emit("change", value);
  trackEmit({
    component: "Calendar",
    type: "select",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value: toISODate(date) },
  });
}
function focusDate(date: Date) {
  focusedDate.value = date;
  if (date.getMonth() !== internalView.value.getMonth()) setView(date);
  void nextTick(() =>
    rootRef.value
      ?.querySelector<HTMLElement>(`[data-date="${toISODate(date)}"]`)
      ?.focus(),
  );
}
function onKeydown(event: KeyboardEvent, date: Date) {
  let next = new Date(date);
  if (event.key === "ArrowLeft") next.setDate(date.getDate() - 1);
  else if (event.key === "ArrowRight") next.setDate(date.getDate() + 1);
  else if (event.key === "ArrowUp") next.setDate(date.getDate() - 7);
  else if (event.key === "ArrowDown") next.setDate(date.getDate() + 7);
  else if (event.key === "Home")
    next.setDate(
      date.getDate() - ((date.getDay() - props.firstDayOfWeek + 7) % 7),
    );
  else if (event.key === "End")
    next.setDate(
      date.getDate() + (6 - ((date.getDay() - props.firstDayOfWeek + 7) % 7)),
    );
  else if (event.key === "PageUp")
    next = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
  else if (event.key === "PageDown")
    next = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
  else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    select(date);
    return;
  } else return;
  event.preventDefault();
  if (!isDisabled(next)) focusDate(next);
}
</script>

<template>
  <section
    ref="rootRef"
    :class="['vp-calendar', { 'vp-calendar--disabled': disabled }, props.class]"
    :style="style"
    :aria-labelledby="titleId"
    data-component="Calendar"
  >
    <header class="vp-calendar__header">
      <button
        type="button"
        class="vp-calendar__nav"
        :disabled="disabled"
        :aria-label="t('common.previous')"
        @click="moveMonth(-1)"
      >
        <Icon name="ChevronLeft" size="sm" />
      </button>
      <h3 :id="titleId" class="vp-calendar__title">
        <slot name="header" :date="internalView" :label="monthLabel">{{
          monthLabel
        }}</slot>
      </h3>
      <button
        type="button"
        class="vp-calendar__nav"
        :disabled="disabled"
        :aria-label="t('common.next')"
        @click="moveMonth(1)"
      >
        <Icon name="ChevronRight" size="sm" />
      </button>
    </header>
    <div class="vp-calendar__grid" role="grid" :aria-labelledby="titleId">
      <div class="vp-calendar__weekdays" role="row">
        <span v-for="label in weekdays" :key="label" role="columnheader">{{
          label
        }}</span>
      </div>
      <div
        v-for="(week, weekIndex) in weeks"
        :key="weekIndex"
        class="vp-calendar__week"
        role="row"
      >
        <button
          v-for="date in week"
          :key="toISODate(date)"
          type="button"
          role="gridcell"
          class="vp-calendar__day"
          :class="{
            'vp-calendar__day--outside':
              date.getMonth() !== internalView.getMonth(),
            'vp-calendar__day--selected': sameDate(date, selectedDate),
            'vp-calendar__day--today': sameDate(date, today),
          }"
          :data-date="toISODate(date)"
          :disabled="
            isDisabled(date) ||
            (!showAdjacent && date.getMonth() !== internalView.getMonth())
          "
          :tabindex="sameDate(date, focusedDate) ? 0 : -1"
          :aria-selected="sameDate(date, selectedDate)"
          :aria-current="sameDate(date, today) ? 'date' : undefined"
          @click="select(date)"
          @keydown="onKeydown($event, date)"
        >
          <slot
            name="date"
            :date="date"
            :selected="sameDate(date, selectedDate)"
            >{{
              showAdjacent || date.getMonth() === internalView.getMonth()
                ? date.getDate()
                : ""
            }}</slot
          >
        </button>
      </div>
    </div>
    <footer v-if="showToday || $slots.footer" class="vp-calendar__footer">
      <slot name="footer"
        ><button
          type="button"
          class="vp-calendar__today"
          :disabled="isDisabled(today)"
          @click="select(today)"
        >
          {{ t("common.today") }}
        </button></slot
      >
    </footer>
  </section>
</template>
