<script setup lang="ts">
import { computed } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import Icon from "@amg-webui/core/Icon/index.vue";
import type { DataCardEmits, DataCardProps, DataCardTrend } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<DataCardProps>(), {
  loading: false,
  disabled: false,
  clickable: false,
  selected: false,
  telemetry: undefined,
});
const emit = defineEmits<DataCardEmits>();
const { t } = useLocale();
const rawValue = computed(() => props.value ?? props.data);
const displayValue = computed(() =>
  props.formatter
    ? props.formatter(rawValue.value)
    : rawValue.value == null || rawValue.value === ""
      ? "—"
      : String(rawValue.value),
);
const trendType = computed<DataCardTrend>(
  () =>
    props.trendType ??
    (Number(props.trend) > 0
      ? "up"
      : Number(props.trend) < 0
        ? "down"
        : "flat"),
);
const progressValue = computed(() =>
  props.progress == null
    ? undefined
    : Math.min(100, Math.max(0, props.progress)),
);
const interactive = computed(
  () => props.clickable && !props.disabled && !props.loading,
);

function activate(event: MouseEvent | KeyboardEvent) {
  if (!interactive.value) return;
  if (event instanceof KeyboardEvent) event.preventDefault();
  const next = !props.selected;
  emit("update:selected", next);
  emit("change", next);
  if (event instanceof MouseEvent) emit("click", event);
  trackEmit({
    component: "DataCard",
    type: "select",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { selected: next },
  });
}
</script>

<template>
  <div
    :class="[
      'vp-data-card',
      {
        'vp-data-card--disabled': disabled,
        'vp-data-card--loading': loading,
        'vp-data-card--interactive': interactive,
        'vp-data-card--selected': selected,
      },
      props.class,
    ]"
    :style="style"
    :role="interactive ? 'button' : undefined"
    :tabindex="interactive ? 0 : undefined"
    :aria-pressed="interactive ? selected : undefined"
    :aria-busy="loading || undefined"
    :aria-label="interactive && !title ? t('component.data-card.title') : undefined"
    data-component="DataCard"
    @click="activate"
    @keydown.enter="activate"
    @keydown.space="activate"
  >
    <header class="vp-data-card__header">
      <div class="vp-data-card__heading">
        <slot name="icon"
          ><Icon v-if="icon" :name="icon" size="md" class="vp-data-card__icon"
        /></slot>
        <h3 class="vp-data-card__title">
          <slot name="title">{{
            title ?? t("component.data-card.title")
          }}</slot>
        </h3>
      </div>
      <slot name="action" />
    </header>
    <div v-if="loading" class="vp-data-card__skeleton" aria-hidden="true">
      <i /><i /><i />
    </div>
    <template v-else>
      <div
        class="vp-data-card__metric"
        :class="status ? `vp-data-card__metric--${status}` : undefined"
      >
        <span v-if="prefix" class="vp-data-card__affix">{{ prefix }}</span>
        <strong class="vp-data-card__value"
          ><slot name="value" :value="rawValue">{{
            displayValue
          }}</slot></strong
        >
        <span v-if="suffix" class="vp-data-card__affix">{{ suffix }}</span>
      </div>
      <div
        v-if="trend != null || trendLabel"
        :class="['vp-data-card__trend', `vp-data-card__trend--${trendType}`]"
      >
        <Icon
          :name="
            trendType === 'up'
              ? 'TrendingUp'
              : trendType === 'down'
                ? 'TrendingDown'
                : 'Minus'
          "
          size="sm"
        />
        <span v-if="trend != null">{{ Math.abs(trend) }}%</span
        ><span v-if="trendLabel">{{ trendLabel }}</span>
      </div>
      <p v-if="description" class="vp-data-card__description">
        {{ description }}
      </p>
      <div
        v-if="progressValue != null"
        class="vp-data-card__progress"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="progressValue"
        :aria-label="t('component.progress.aria')"
      >
        <span :style="{ width: `${progressValue}%` }" />
      </div>
      <div v-if="$slots.default" class="vp-data-card__body"><slot /></div>
      <footer v-if="$slots.footer" class="vp-data-card__footer">
        <slot name="footer" />
      </footer>
    </template>
  </div>
</template>
