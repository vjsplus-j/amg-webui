<script setup lang="ts">
import { moveRovingIndex, resolveKeyboardNavAction } from '@amg-webui/utils'
import { computed, provide, ref } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import TimelineItem from "../TimelineItem/index.vue";
import type { TimelineEmits, TimelineKey, TimelineProps } from "./types";
import { TIMELINE_INJECTION_KEY } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<TimelineProps>(), {
  items: () => [],
  mode: "left",
  pending: false,
  reverse: false,
  selectable: false,
  modelValue: null,
  telemetry: undefined,
});
const emit = defineEmits<TimelineEmits>();
const { t } = useLocale();
const count = ref(0);
const activeKey = computed(() => props.modelValue);
const selectable = computed(() => props.selectable);
function itemByKey(key: TimelineKey) {
  return props.items.find((item, index) => (item.itemKey ?? index) === key);
}
function select(key: TimelineKey, event: MouseEvent | KeyboardEvent) {
  const item = itemByKey(key);
  if (!props.selectable || item?.disabled) return;
  emit("update:modelValue", key);
  emit("change", key);
  emit("itemClick", item, event);
  trackEmit({
    component: "Timeline",
    type: "select",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { key },
  });
}
provide(TIMELINE_INJECTION_KEY, {
  mode: computed(() => props.mode),
  activeKey,
  selectable,
  claimIndex: () => count.value++,
  select,
});
const rootClass = computed(() => [
  "vp-timeline",
  `vp-timeline--mode-${props.mode}`,
  {
    "vp-timeline--reverse": props.reverse,
    "vp-timeline--selectable": props.selectable,
  },
  props.class,
]);
const pendingLabel = computed(() =>
  typeof props.pending === "string" && props.pending
    ? props.pending
    : t(LocaleKeys.component.timeline.pending),
);

const rootRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

function selectableKeys() {
  return props.items
    .map((item, index) => ({ key: (item.itemKey ?? index) as TimelineKey, disabled: !!item.disabled }))
    .filter((item) => !item.disabled)
    .map((item) => item.key)
}

function onRootKeydown(event: KeyboardEvent) {
  if (!props.selectable) return
  const keys = selectableKeys()
  if (!keys.length) return
  const action = resolveKeyboardNavAction(event, { orientation: 'vertical' })
  if (action === 'none' || action === 'close') return
  event.preventDefault()
  if (action === 'select') {
    const key = keys[activeIndex.value] ?? keys[0]
    select(key, event)
    return
  }
  activeIndex.value = moveRovingIndex(activeIndex.value, action, keys.length, true)
  const key = keys[activeIndex.value]
  if (key != null) select(key, event)
}
</script>
<template>
  <ul
    ref="rootRef"
    :class="rootClass"
    :style="style"
    role="list"
    data-component="Timeline"
    :tabindex="selectable ? 0 : undefined"
    @keydown="onRootKeydown"
  >
    <TimelineItem
      v-for="(item, index) in items"
      :key="item.itemKey ?? index"
      v-bind="item"
      :item-key="item.itemKey ?? index"
      :clickable="selectable || item.clickable"
    >
      <template #default
        ><slot name="item" :item="item" :index="index"
          ><h4 v-if="item.title" class="vp-timeline__item-title">
            {{ item.title }}
          </h4>
          <p v-if="item.description" class="vp-timeline__item-description">
            {{ item.description }}
          </p></slot
        ></template
      >
    </TimelineItem>
    <slot />
    <li
      v-if="pending !== false && pending !== ''"
      class="vp-timeline__pending"
      role="listitem"
      aria-live="polite"
    >
      <div class="vp-timeline-item__axis">
        <span
          class="vp-timeline-item__dot vp-timeline-item__dot--pending"
          aria-hidden="true"
        />
      </div>
      <div class="vp-timeline-item__content">
        <span>{{ pendingLabel }}</span>
      </div>
    </li>
  </ul>
</template>
