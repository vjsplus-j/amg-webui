<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import type {
  TimelineListEmits,
  TimelineListItem,
  TimelineListKey,
  TimelineListProps,
} from "./types";
import "./style.scss";

const props = withDefaults(defineProps<TimelineListProps>(), {
  items: () => [],
  modelValue: null,
  selectable: true,
  reverse: false,
  groupBy: "day",
  collapsible: false,
  defaultExpandedKeys: () => [],
  disabled: false,
  loading: false,
  pending: false,
  telemetry: undefined,
});
const emit = defineEmits<TimelineListEmits>();
const { t, locale } = useLocale();
const expandedKeys = ref(new Set<string>());

const list = computed(() => {
  const source = props.items.length ? props.items : (props.data ?? []);
  return props.reverse ? [...source].reverse() : source;
});
function itemKey(item: TimelineListItem, index: number): TimelineListKey {
  return item.id ?? item.itemKey ?? index;
}
function groupKey(item: TimelineListItem) {
  if (typeof props.groupBy === "function") return props.groupBy(item);
  if (props.groupBy === "none") return "";
  if (item.time instanceof Date)
    return new Intl.DateTimeFormat(locale.value, {
      dateStyle: "medium",
    }).format(item.time);
  return String(item.time).split(/[T\s]/)[0] || String(item.time);
}
const groups = computed(() => {
  const map = new Map<
    string,
    Array<{ item: TimelineListItem; index: number }>
  >();
  list.value.forEach((item, index) => {
    const key = groupKey(item);
    map.set(key, [...(map.get(key) ?? []), { item, index }]);
  });
  return [...map.entries()].map(([key, entries]) => ({ key, entries }));
});
watch(
  groups,
  (value) => {
    if (!props.collapsible) return;
    const requested = props.defaultExpandedKeys;
    expandedKeys.value = new Set(
      requested.length ? requested : value.map((group) => group.key),
    );
  },
  { immediate: true },
);
function isExpanded(key: string) {
  return !props.collapsible || expandedKeys.value.has(key);
}
function toggleGroup(key: string) {
  if (!props.collapsible || props.disabled) return;
  const next = new Set(expandedKeys.value);
  next.has(key) ? next.delete(key) : next.add(key);
  expandedKeys.value = next;
  emit("groupToggle", key, next.has(key));
  trackEmit({
    component: "TimelineList",
    type: "groupToggle",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { key, expanded: next.has(key) },
  });
}
function activate(
  item: TimelineListItem,
  index: number,
  event: MouseEvent | KeyboardEvent,
) {
  if (props.disabled || item.disabled) return;
  const key = itemKey(item, index);
  if (props.selectable) {
    emit("update:modelValue", key);
    emit("change", key, item);
  }
  emit("itemClick", item, index, event);
  if (event instanceof MouseEvent) emit("click", event);
  trackEmit({
    component: "TimelineList",
    type: "itemClick",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { key, index },
  });
}
function onKeydown(
  item: TimelineListItem,
  index: number,
  event: KeyboardEvent,
) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  activate(item, index, event);
}
function formatTime(value: TimelineListItem["time"]) {
  if (value instanceof Date)
    return new Intl.DateTimeFormat(locale.value, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(value);
  return String(value);
}
const titleText = computed(
  () => props.title ?? t("component.timeline-list.title"),
);
</script>

<template>
  <section
    :class="[
      'vp-timeline-list',
      {
        'vp-timeline-list--disabled': disabled,
        'vp-timeline-list--reverse': reverse,
      },
      props.class,
    ]"
    :style="style"
    :aria-label="ariaLabel ?? titleText"
    :aria-busy="loading"
    data-component="TimelineList"
  >
    <header
      v-if="titleText || description || $slots.header"
      class="vp-timeline-list__header"
    >
      <slot name="header"
        ><h3>{{ titleText }}</h3>
        <p v-if="description">{{ description }}</p></slot
      >
    </header>
    <div v-if="loading" class="vp-timeline-list__state" role="status">
      {{ t("common.loading") }}
    </div>
    <div v-else-if="groups.length" class="vp-timeline-list__track" role="list">
      <section
        v-for="group in groups"
        :key="group.key"
        class="vp-timeline-list__group"
      >
        <button
          v-if="group.key && collapsible"
          type="button"
          class="vp-timeline-list__group-toggle"
          :aria-expanded="isExpanded(group.key)"
          @click="toggleGroup(group.key)"
        >
          <slot
            name="group-label"
            :group="group.key"
            :items="group.entries.map((entry) => entry.item)"
            >{{ group.key }}</slot
          ><span aria-hidden="true">⌄</span>
        </button>
        <h4 v-else-if="group.key" class="vp-timeline-list__day">
          <slot
            name="group-label"
            :group="group.key"
            :items="group.entries.map((entry) => entry.item)"
            >{{ group.key }}</slot
          >
        </h4>
        <div v-show="isExpanded(group.key)" class="vp-timeline-list__items">
          <article
            v-for="entry in group.entries"
            :key="itemKey(entry.item, entry.index)"
            :class="[
              'vp-timeline-list__item',
              `vp-timeline-list__item--${entry.item.status ?? 'info'}`,
              {
                'vp-timeline-list__item--selected':
                  modelValue === itemKey(entry.item, entry.index),
                'vp-timeline-list__item--disabled': entry.item.disabled,
              },
            ]"
            role="listitem"
            :tabindex="disabled || entry.item.disabled ? -1 : 0"
            :aria-current="
              modelValue === itemKey(entry.item, entry.index)
                ? 'step'
                : undefined
            "
            @click="activate(entry.item, entry.index, $event)"
            @keydown="onKeydown(entry.item, entry.index, $event)"
          >
            <span class="vp-timeline-list__dot" aria-hidden="true"
              ><slot name="icon" :item="entry.item">{{
                entry.item.icon
              }}</slot></span
            >
            <slot name="item" :item="entry.item" :index="entry.index">
              <time class="vp-timeline-list__time">{{
                formatTime(entry.item.time)
              }}</time>
              <h5 class="vp-timeline-list__title">{{ entry.item.title }}</h5>
              <p
                v-if="entry.item.content || entry.item.description"
                class="vp-timeline-list__content"
              >
                {{ entry.item.content ?? entry.item.description }}
              </p>
            </slot>
          </article>
        </div>
      </section>
      <div v-if="pending" class="vp-timeline-list__pending" role="status">
        <span class="vp-timeline-list__dot" aria-hidden="true" /><slot
          name="pending"
          >{{
            typeof pending === "string" ? pending : t("common.loading")
          }}</slot
        >
      </div>
    </div>
    <div v-else class="vp-timeline-list__state" role="status">
      <slot name="empty">{{ emptyText ?? t("common.noData") }}</slot>
    </div>
  </section>
</template>
