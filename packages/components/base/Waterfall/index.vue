<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import type { WaterfallEmits, WaterfallItem, WaterfallProps } from "./types";
import "./style.scss";
const props = withDefaults(defineProps<WaterfallProps>(), {
  data: () => [],
  items: () => [],
  modelValue: null,
  columns: 3,
  disabled: false,
  loading: false,
  clickable: true,
  telemetry: undefined,
});
const emit = defineEmits<WaterfallEmits>();
const { t } = useLocale();
const cardRefs = new Map<string | number, HTMLElement>();
const measured = new Map<string | number, number>();
const version = ref(0);
const sentinelRef = ref<HTMLElement | null>(null);
let resizeObserver: ResizeObserver | null = null;
let endObserver: IntersectionObserver | null = null;
let endEmitted = false;
const list = computed(() => (props.items.length ? props.items : props.data));
const columnCount = computed(() =>
  Math.min(12, Math.max(1, Math.floor(props.columns))),
);
const buckets = computed(() => {
  void version.value;
  const result: WaterfallItem[][] = Array.from(
    { length: columnCount.value },
    () => [],
  );
  const heights = Array(columnCount.value).fill(0);
  list.value.forEach((item, index) => {
    const known = measured.get(item.id) ?? item.height ?? 0;
    const minimum = Math.min(...heights);
    const candidates = heights
      .map((height, i) => (height === minimum ? i : -1))
      .filter((i) => i >= 0);
    const target = candidates[index % candidates.length] ?? 0;
    result[target].push(item);
    heights[target] += known;
  });
  return result;
});
watch(buckets, (value) => emit("layoutChange", value), { immediate: true });
watch(
  () => list.value.length,
  () => {
    endEmitted = false;
    void nextTick(measureAll);
  },
);
function setCard(item: WaterfallItem, element: Element | null) {
  const previous = cardRefs.get(item.id);
  if (previous) resizeObserver?.unobserve(previous);
  if (!(element instanceof HTMLElement)) {
    cardRefs.delete(item.id);
    return;
  }
  cardRefs.set(item.id, element);
  resizeObserver?.observe(element);
  measure(item.id, element);
}
function measure(id: string | number, element: HTMLElement) {
  const height = element.getBoundingClientRect().height || element.offsetHeight;
  if (height > 0 && measured.get(id) !== height) {
    measured.set(id, height);
    version.value++;
  }
}
function measureAll() {
  cardRefs.forEach((element, id) => measure(id, element));
}
function activate(item: WaterfallItem, event: MouseEvent | KeyboardEvent) {
  if (!props.clickable || props.disabled || item.disabled) return;
  if (event instanceof KeyboardEvent) event.preventDefault();
  emit("update:modelValue", item.id);
  emit("change", item.id);
  emit("itemClick", item, event);
  trackEmit({
    component: "Waterfall",
    type: "itemClick",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { id: item.id },
  });
}
function imageDone(item: WaterfallItem, event: Event, failed = false) {
  void nextTick(measureAll);
  if (failed) emit("imageError", item, event);
  else emit("imageLoad", item, event);
}
onMounted(() => {
  if (typeof ResizeObserver !== "undefined")
    resizeObserver = new ResizeObserver(measureAll);
  if (typeof IntersectionObserver !== "undefined") {
    endObserver = new IntersectionObserver((entries) => {
      if (
        entries.some((entry) => entry.isIntersecting) &&
        !props.loading &&
        !endEmitted
      ) {
        endEmitted = true;
        emit("reachEnd");
      }
    });
    if (sentinelRef.value) endObserver.observe(sentinelRef.value);
  }
  void nextTick(measureAll);
});
onUnmounted(() => {
  resizeObserver?.disconnect();
  endObserver?.disconnect();
});
</script>
<template>
  <section
    :class="[
      'vp-waterfall',
      { 'vp-waterfall--disabled': disabled },
      props.class,
    ]"
    :style="style"
    :aria-busy="loading"
    data-component="Waterfall"
  >
    <header
      v-if="title || description || $slots.header"
      class="vp-waterfall__header"
    >
      <slot name="header"
        ><div>
          <h3 v-if="title" class="vp-waterfall__heading">{{ title }}</h3>
          <p v-if="description" class="vp-waterfall__description">
            {{ description }}
          </p>
        </div></slot
      >
    </header>
    <div
      v-if="list.length"
      class="vp-waterfall__grid"
      :style="{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }"
    >
      <div
        v-for="(column, columnIndex) in buckets"
        :key="columnIndex"
        class="vp-waterfall__column"
      >
        <article
          v-for="item in column"
          :key="item.id"
          :ref="(element) => setCard(item, element as Element | null)"
          :class="[
            'vp-waterfall__card',
            {
              'vp-waterfall__card--selected': modelValue === item.id,
              'vp-waterfall__card--interactive':
                clickable && !disabled && !item.disabled,
              'vp-waterfall__card--disabled': item.disabled,
            },
          ]"
          :role="clickable ? 'button' : undefined"
          :tabindex="clickable && !disabled && !item.disabled ? 0 : undefined"
          :aria-pressed="clickable ? modelValue === item.id : undefined"
          @click="activate(item, $event)"
          @keydown.enter="activate(item, $event)"
          @keydown.space="activate(item, $event)"
        >
          <slot name="item" :item="item" :selected="modelValue === item.id"
            ><img
              v-if="item.image"
              class="vp-waterfall__image"
              :src="item.image"
              :alt="item.alt ?? item.title ?? ''"
              loading="lazy"
              @load="imageDone(item, $event)"
              @error="imageDone(item, $event, true)"
            />
            <div
              v-if="item.title || item.description"
              class="vp-waterfall__content"
            >
              <h4 v-if="item.title" class="vp-waterfall__title">
                {{ item.title }}
              </h4>
              <p v-if="item.description" class="vp-waterfall__item-description">
                {{ item.description }}
              </p>
            </div></slot
          >
        </article>
      </div>
    </div>
    <div v-else-if="!loading" class="vp-waterfall__empty" role="status">
      <slot name="empty">{{ emptyText ?? t("common.noData") }}</slot>
    </div>
    <div v-if="loading" class="vp-waterfall__loading" role="status">
      {{ t("common.loading") }}
    </div>
    <div ref="sentinelRef" class="vp-waterfall__sentinel" aria-hidden="true" />
  </section>
</template>
