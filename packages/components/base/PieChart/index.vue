<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import { chartColor } from "@amg-webui/utils/data-display/chartHelpers";
import type {
  PieChartDatum,
  PieChartEmits,
  PieChartKey,
  PieChartProps,
} from "./types";
import "./style.scss";

const props = withDefaults(defineProps<PieChartProps>(), {
  data: () => [],
  modelValue: null,
  selectionValue: "key",
  disabled: false,
  loading: false,
  radius: 64,
  innerRadius: 0,
  startAngle: -90,
  showLegend: true,
  showLabels: false,
  showPercent: true,
  telemetry: undefined,
});
const emit = defineEmits<PieChartEmits>();
const { t, locale } = useLocale();
const sliceRefs = ref<SVGPathElement[]>([]);
const items = computed<PieChartDatum[]>(() =>
  props.data.map((item, index) =>
    typeof item === "number"
      ? {
          key: index,
          label: String(index + 1),
          value: Math.max(0, Number(item) || 0),
        }
      : {
          ...item,
          key: item.key ?? index,
          value: Math.max(0, Number(item.value) || 0),
        },
  ),
);
const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.value, 0),
);
const outerRadius = computed(() => Math.min(76, Math.max(16, props.radius)));
const holeRadius = computed(() =>
  Math.min(outerRadius.value - 1, Math.max(0, props.innerRadius)),
);
function point(radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: 80 + radius * Math.cos(radians),
    y: 80 + radius * Math.sin(radians),
  };
}
const slices = computed(() => {
  let start = props.startAngle;
  return items.value.map((datum, index) => {
    const sweep = total.value > 0 ? (datum.value / total.value) * 360 : 0;
    const safeSweep = sweep >= 360 ? 359.999 : sweep;
    const end = start + safeSweep;
    const outerStart = point(outerRadius.value, start);
    const outerEnd = point(outerRadius.value, end);
    const large = safeSweep > 180 ? 1 : 0;
    let path = `M 80 80 L ${outerStart.x} ${outerStart.y} A ${outerRadius.value} ${outerRadius.value} 0 ${large} 1 ${outerEnd.x} ${outerEnd.y} Z`;
    if (holeRadius.value > 0) {
      const innerStart = point(holeRadius.value, start);
      const innerEnd = point(holeRadius.value, end);
      path = `M ${outerStart.x} ${outerStart.y} A ${outerRadius.value} ${outerRadius.value} 0 ${large} 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${holeRadius.value} ${holeRadius.value} 0 ${large} 0 ${innerStart.x} ${innerStart.y} Z`;
    }
    const middle = start + safeSweep / 2;
    const labelPoint = point(
      (outerRadius.value + holeRadius.value) / 2,
      middle,
    );
    start += sweep;
    return {
      datum,
      index,
      path,
      labelPoint,
      color: datum.color ?? chartColor(index),
      percent: total.value ? (datum.value / total.value) * 100 : 0,
    };
  });
});
function keyOf(datum: PieChartDatum, index: number): PieChartKey {
  return props.selectionValue === "value" ? datum.value : (datum.key ?? index);
}
function selected(datum: PieChartDatum, index: number) {
  return props.modelValue === keyOf(datum, index);
}
function formatValue(datum: PieChartDatum) {
  return (
    props.valueFormatter?.(datum.value, datum) ??
    new Intl.NumberFormat(locale.value).format(datum.value)
  );
}
function formatPercent(value: number) {
  return new Intl.NumberFormat(locale.value, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);
}
function activate(
  index: number,
  event: MouseEvent | KeyboardEvent,
  source: "slice" | "legend" = "slice",
) {
  const datum = items.value[index];
  if (!datum || props.disabled || datum.disabled) return;
  if (event instanceof KeyboardEvent) event.preventDefault();
  const value = keyOf(datum, index);
  emit("update:modelValue", value);
  emit("change", value, datum, index);
  emit("click", event);
  if (source === "slice") emit("sliceClick", datum, index, event);
  else emit("legendClick", datum, index, event);
  trackEmit({
    component: "PieChart",
    type: source === "slice" ? "sliceClick" : "legendClick",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { key: value, value: datum.value },
  });
}
function keydown(event: KeyboardEvent, index: number) {
  if (event.key === "Enter" || event.key === " ") {
    activate(index, event);
    return;
  }
  const direction =
    event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0;
  if (!direction) return;
  event.preventDefault();
  let next = index;
  do {
    next = (next + direction + items.value.length) % items.value.length;
  } while (items.value[next]?.disabled && next !== index);
  void nextTick(() => sliceRefs.value[next]?.focus());
}
function setSliceRef(element: SVGPathElement | null, index: number) {
  if (element) sliceRefs.value[index] = element;
}
</script>

<template>
  <section
    :class="[
      'vp-pie-chart',
      { 'vp-pie-chart--disabled': disabled },
      props.class,
    ]"
    :style="style"
    :aria-label="ariaLabel ?? title ?? t('component.pie-chart.title')"
    :aria-busy="loading"
    data-component="PieChart"
  >
    <header
      v-if="title || description || $slots.header"
      class="vp-pie-chart__header"
    >
      <slot name="header"
        ><h3 v-if="title">{{ title }}</h3>
        <p v-if="description">{{ description }}</p></slot
      >
    </header>
    <div v-if="loading" class="vp-pie-chart__state" role="status">
      {{ t("common.loading") }}
    </div>
    <div v-else-if="slices.length && total > 0" class="vp-pie-chart__body">
      <svg
        class="vp-pie-chart__chart"
        viewBox="0 0 160 160"
        role="list"
        :aria-label="ariaLabel ?? title"
      >
        <g
          v-for="slice in slices"
          :key="slice.datum.key ?? slice.index"
          role="listitem"
        >
          <path
            :ref="
              (element) =>
                setSliceRef(element as SVGPathElement | null, slice.index)
            "
            :d="slice.path"
            :fill="slice.color"
            :class="[
              'vp-pie-chart__slice',
              {
                'vp-pie-chart__slice--selected': selected(
                  slice.datum,
                  slice.index,
                ),
                'vp-pie-chart__slice--disabled': slice.datum.disabled,
              },
            ]"
            role="button"
            :tabindex="slice.datum.disabled || disabled ? -1 : 0"
            :aria-pressed="selected(slice.datum, slice.index)"
            :aria-label="`${slice.datum.label}: ${formatValue(slice.datum)}, ${formatPercent(slice.percent)}`"
            @click="activate(slice.index, $event)"
            @keydown="keydown($event, slice.index)"
          >
            <title>
              {{ slice.datum.label }}: {{ formatValue(slice.datum) }}
            </title>
          </path>
          <text
            v-if="showLabels && slice.percent >= 4"
            :x="slice.labelPoint.x"
            :y="slice.labelPoint.y"
            class="vp-pie-chart__label"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ showPercent ? formatPercent(slice.percent) : slice.datum.label }}
          </text>
        </g>
        <slot name="center" :total="total" />
      </svg>
      <ul v-if="showLegend" class="vp-pie-chart__legend">
        <li v-for="slice in slices" :key="slice.datum.key ?? slice.index">
          <button
            type="button"
            :disabled="disabled || slice.datum.disabled"
            :aria-pressed="selected(slice.datum, slice.index)"
            @click="activate(slice.index, $event, 'legend')"
          >
            <i :style="{ background: slice.color }" /><span>{{
              slice.datum.label
            }}</span
            ><strong>{{
              showPercent
                ? formatPercent(slice.percent)
                : formatValue(slice.datum)
            }}</strong>
          </button>
        </li>
      </ul>
    </div>
    <div v-else class="vp-pie-chart__state" role="status">
      <slot name="empty">{{ emptyText ?? t("common.noData") }}</slot>
    </div>
  </section>
</template>
