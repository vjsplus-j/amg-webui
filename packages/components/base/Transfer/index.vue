<script setup lang="ts">
import { computed, ref } from "vue";
import { onUnmounted, watch } from "vue";
import type { TransferProps, TransferEmits, TransferItem } from "./types";
import { useVirtualWindow } from "./useVirtualWindow";
import InputText from "../InputText/index.vue";
import Icon from "../Icon/index.vue";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import { useFormItem } from "../FormItem/useFormItem";
import "./style.scss";

defineOptions({ inheritAttrs: false, name: "Transfer" });

const props = withDefaults(defineProps<TransferProps>(), {
  data: () => [],
  modelValue: () => [],
  filterable: false,
  filterDebounce: 200,
  virtual: true,
  loading: false,
  telemetry: undefined,
});

const emit = defineEmits<TransferEmits>();
const { t } = useLocale();

const {
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  validateOnChange,
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
  name: () => props.name,
});

const leftFilter = ref("");
const rightFilter = ref("");
const leftQuery = ref("");
const rightQuery = ref("");
const leftChecked = ref<(string | number)[]>([]);
const rightChecked = ref<(string | number)[]>([]);
const leftBodyRef = ref<HTMLElement | null>(null);
const rightBodyRef = ref<HTMLElement | null>(null);
let leftFilterTimer: ReturnType<typeof setTimeout> | undefined;
let rightFilterTimer: ReturnType<typeof setTimeout> | undefined;
let leftAtEnd = false;
let rightAtEnd = false;

const selectedSet = computed(() => new Set(props.modelValue ?? []));

const leftItems = computed(() =>
  (props.data ?? []).filter((item) => !selectedSet.value.has(item.key)),
);

const rightItems = computed(() =>
  (props.data ?? []).filter((item) => selectedSet.value.has(item.key)),
);

const filterItems = (
  items: TransferItem[],
  query: string,
  direction: "left" | "right",
) => {
  if (!query) return items;
  if (props.filterMethod)
    return items.filter((item) => props.filterMethod?.(query, item, direction));
  const q = query.toLowerCase();
  return items.filter((item) => item.label.toLowerCase().includes(q));
};

const filteredLeft = computed(() =>
  filterItems(leftItems.value, leftQuery.value, "left"),
);
const filteredRight = computed(() =>
  filterItems(rightItems.value, rightQuery.value, "right"),
);

const leftVirtual = useVirtualWindow(filteredLeft, 280, leftBodyRef);
const rightVirtual = useVirtualWindow(filteredRight, 280, rightBodyRef);
const virtualEnabled = computed(() => props.virtual !== false);
const leftDisplayItems = computed(() =>
  virtualEnabled.value
    ? leftVirtual.visibleItems.value.map((entry) => entry.item)
    : filteredLeft.value,
);
const rightDisplayItems = computed(() =>
  virtualEnabled.value
    ? rightVirtual.visibleItems.value.map((entry) => entry.item)
    : filteredRight.value,
);

function scheduleFilter(direction: "left" | "right", query: string) {
  const currentTimer =
    direction === "left" ? leftFilterTimer : rightFilterTimer;
  if (currentTimer) clearTimeout(currentTimer);
  const timer = setTimeout(
    () => {
      if (direction === "left") {
        leftQuery.value = query;
        leftVirtual.reset();
      } else {
        rightQuery.value = query;
        rightVirtual.reset();
      }
      emit("filter-change", { direction, query });
      trackEmit({
        component: "Transfer",
        type: "filter",
        trackId: props.trackId,
        telemetry: props.telemetry,
        payload: { direction, queryLength: query.length },
      });
    },
    Math.max(0, props.filterDebounce),
  );
  if (direction === "left") leftFilterTimer = timer;
  else rightFilterTimer = timer;
}

watch(leftFilter, (query) => scheduleFilter("left", query));
watch(rightFilter, (query) => scheduleFilter("right", query));
watch(
  [() => filteredLeft.value.length, () => filteredRight.value.length],
  () => {
    leftVirtual.reset();
    rightVirtual.reset();
  },
);

onUnmounted(() => {
  if (leftFilterTimer) clearTimeout(leftFilterTimer);
  if (rightFilterTimer) clearTimeout(rightFilterTimer);
});

const rootClass = computed(() => [
  "vp-transfer",
  { "vp-transfer--disabled": isDisabled.value },
  props.class,
]);

const emitKeys = (keys: (string | number)[]) => {
  emit("update:modelValue", keys);
  emit("change", keys);
  void validateOnChange();
};

const toggleCheck = (
  list: (string | number)[],
  key: string | number,
  checked: boolean,
) => {
  const set = new Set(list);
  if (checked) set.add(key);
  else set.delete(key);
  return [...set];
};

const moveToRight = () => {
  if (isDisabled.value || props.loading || !leftChecked.value.length) return;
  const moved = [...leftChecked.value];
  const next = [...new Set([...(props.modelValue ?? []), ...moved])];
  leftChecked.value = [];
  emitKeys(next);
  emit("move", { direction: "right", keys: moved });
  trackEmit({
    component: "Transfer",
    type: "move-right",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { count: moved.length },
  });
};

const moveToLeft = () => {
  if (isDisabled.value || props.loading || !rightChecked.value.length) return;
  const moved = [...rightChecked.value];
  const remove = new Set(rightChecked.value);
  const next = (props.modelValue ?? []).filter((k) => !remove.has(k));
  rightChecked.value = [];
  emitKeys(next);
  emit("move", { direction: "left", keys: moved });
  trackEmit({
    component: "Transfer",
    type: "move-left",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { count: moved.length },
  });
};

function handleScroll(direction: "left" | "right", event: Event) {
  const virtual = direction === "left" ? leftVirtual : rightVirtual;
  if (virtualEnabled.value) virtual.onScroll(event);
  const element = event.currentTarget as HTMLElement;
  const atEnd =
    element.scrollTop + element.clientHeight >=
    element.scrollHeight - virtual.ITEM_HEIGHT;
  const wasAtEnd = direction === "left" ? leftAtEnd : rightAtEnd;
  if (direction === "left") leftAtEnd = atEnd;
  else rightAtEnd = atEnd;
  if (atEnd && !wasAtEnd) emit("reach-end", direction);
}
</script>

<template>
  <div
    :id="inputId"
    :class="rootClass"
    :style="style"
    role="group"
    :aria-invalid="isInvalid || undefined"
    :aria-required="isRequired || undefined"
    :aria-describedby="ariaDescribedby"
    :aria-busy="loading || undefined"
  >
    <div class="vp-transfer__panel">
      <div class="vp-transfer__header">
        <slot name="left-title" :count="leftItems.length">{{ leftTitle }}</slot>
      </div>
      <div v-if="filterable" class="vp-transfer__filter">
        <InputText
          v-model="leftFilter"
          :placeholder="filterPlaceholder ?? t(LocaleKeys.common.search)"
          :disabled="isDisabled || loading"
        />
      </div>
      <div
        ref="leftBodyRef"
        class="vp-transfer__body"
        @scroll="handleScroll('left', $event)"
      >
        <div
          class="vp-transfer__list"
          :style="
            virtualEnabled
              ? { height: `${leftVirtual.totalHeight.value}px` }
              : undefined
          "
        >
          <div
            :style="
              virtualEnabled
                ? { transform: `translateY(${leftVirtual.offsetY.value}px)` }
                : undefined
            "
          >
            <label
              v-for="item in leftDisplayItems"
              :key="item.key"
              class="vp-transfer__item"
              :class="{ 'vp-transfer__item--disabled': item.disabled }"
              :style="{ height: `${leftVirtual.ITEM_HEIGHT}px` }"
            >
              <input
                type="checkbox"
                :checked="leftChecked.includes(item.key)"
                :disabled="item.disabled || isDisabled || loading"
                @change="
                  leftChecked = toggleCheck(
                    leftChecked,
                    item.key,
                    ($event.target as HTMLInputElement).checked,
                  )
                "
              />
              <span>{{ item.label }}</span>
            </label>
          </div>
          <p
            v-if="!filteredLeft.length"
            class="vp-transfer__empty"
            role="status"
          >
            {{ emptyText ?? t("common.noData") }}
          </p>
        </div>
      </div>
    </div>

    <div class="vp-transfer__actions">
      <button
        type="button"
        class="vp-transfer__action"
        :disabled="isDisabled || loading || !leftChecked.length"
        :aria-label="t(LocaleKeys.common.next)"
        @click="moveToRight"
      >
        <Icon name="ChevronRight" size="sm" />
      </button>
      <button
        type="button"
        class="vp-transfer__action"
        :disabled="isDisabled || loading || !rightChecked.length"
        :aria-label="t(LocaleKeys.common.previous)"
        @click="moveToLeft"
      >
        <Icon name="ChevronLeft" size="sm" />
      </button>
    </div>

    <div class="vp-transfer__panel">
      <div class="vp-transfer__header">
        <slot name="right-title" :count="rightItems.length">{{
          rightTitle
        }}</slot>
      </div>
      <div v-if="filterable" class="vp-transfer__filter">
        <InputText
          v-model="rightFilter"
          :placeholder="filterPlaceholder ?? t(LocaleKeys.common.search)"
          :disabled="isDisabled || loading"
        />
      </div>
      <div
        ref="rightBodyRef"
        class="vp-transfer__body"
        @scroll="handleScroll('right', $event)"
      >
        <div
          class="vp-transfer__list"
          :style="
            virtualEnabled
              ? { height: `${rightVirtual.totalHeight.value}px` }
              : undefined
          "
        >
          <div
            :style="
              virtualEnabled
                ? { transform: `translateY(${rightVirtual.offsetY.value}px)` }
                : undefined
            "
          >
            <label
              v-for="item in rightDisplayItems"
              :key="item.key"
              class="vp-transfer__item"
              :class="{ 'vp-transfer__item--disabled': item.disabled }"
              :style="{ height: `${rightVirtual.ITEM_HEIGHT}px` }"
            >
              <input
                type="checkbox"
                :checked="rightChecked.includes(item.key)"
                :disabled="item.disabled || isDisabled || loading"
                @change="
                  rightChecked = toggleCheck(
                    rightChecked,
                    item.key,
                    ($event.target as HTMLInputElement).checked,
                  )
                "
              />
              <span>{{ item.label }}</span>
            </label>
          </div>
          <p
            v-if="!filteredRight.length"
            class="vp-transfer__empty"
            role="status"
          >
            {{ emptyText ?? t("common.noData") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
