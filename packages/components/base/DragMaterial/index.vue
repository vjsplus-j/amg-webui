<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import type { CanvasMaterialItem } from "@amg-webui/utils";
import type { DragMaterialEmits, DragMaterialProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<DragMaterialProps>(), {
  materials: () => [],
  filter: "",
  searchable: true,
  disabled: false,
  loading: false,
  telemetry: undefined,
});
const emit = defineEmits<DragMaterialEmits>();
const { t } = useLocale();
const query = ref(props.filter);
const draggingType = ref<string | null>(null);
watch(
  () => props.filter,
  (value) => {
    query.value = value;
  },
);

const groups = computed(
  () =>
    [
      ...new Set(props.materials.map((item) => item.group).filter(Boolean)),
    ] as string[],
);
const list = computed(() => {
  const normalized = query.value.trim().toLocaleLowerCase();
  return props.materials.filter(
    (item) =>
      (!props.group || item.group === props.group) &&
      (!normalized ||
        item.label.toLocaleLowerCase().includes(normalized) ||
        item.type.toLocaleLowerCase().includes(normalized)),
  );
});
function search(event: Event) {
  query.value = (event.target as HTMLInputElement).value;
  emit("update:filter", query.value);
  emit("search", query.value);
}
function dragStart(event: DragEvent, item: CanvasMaterialItem) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  event.dataTransfer?.setData("application/vp-material-type", item.type);
  event.dataTransfer?.setData("application/vp-material-label", item.label);
  event.dataTransfer?.setData("application/vp-material", JSON.stringify(item));
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
  draggingType.value = item.type;
  emit("drag-start", item);
  emit("dragStart", item, event);
  trackEmit({
    component: "DragMaterial",
    type: "dragStart",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { type: item.type, group: item.group },
  });
}
function dragEnd(event: DragEvent, item: CanvasMaterialItem) {
  draggingType.value = null;
  emit("dragEnd", item, event);
}
function pick(item: CanvasMaterialItem, event: MouseEvent | KeyboardEvent) {
  if (props.disabled) return;
  if (event instanceof KeyboardEvent) event.preventDefault();
  emit("pick", item, event);
  trackEmit({
    component: "DragMaterial",
    type: "pick",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { type: item.type, group: item.group },
  });
}
</script>

<template>
  <aside
    :class="[
      'vp-drag-material',
      { 'vp-drag-material--disabled': disabled },
      props.class,
    ]"
    :style="style"
    data-component="DragMaterial"
    :aria-label="ariaLabel ?? t('common.search')"
    :aria-busy="loading"
  >
    <slot name="header" :groups="groups" />
    <input
      v-if="searchable"
      :value="query"
      class="vp-drag-material__search"
      type="search"
      :disabled="disabled"
      :placeholder="t('common.search')"
      :aria-label="t('common.search')"
      @input="search"
    />
    <div v-if="loading" class="vp-drag-material__loading" role="status">
      {{ t("common.loading") }}
    </div>
    <ul
      v-else-if="list.length"
      class="vp-drag-material__list"
      role="listbox"
      :aria-disabled="disabled"
    >
      <li
        v-for="item in list"
        :key="`${item.group ?? ''}:${item.type}`"
        :class="[
          'vp-drag-material__item',
          { 'vp-drag-material__item--dragging': draggingType === item.type },
        ]"
        :draggable="!disabled"
        role="option"
        :aria-selected="draggingType === item.type"
        :aria-disabled="disabled"
        :tabindex="disabled ? -1 : 0"
        @click="pick(item, $event)"
        @keydown.enter="pick(item, $event)"
        @keydown.space="pick(item, $event)"
        @dragstart="dragStart($event, item)"
        @dragend="dragEnd($event, item)"
      >
        <slot name="item" :item="item" :dragging="draggingType === item.type"
          ><span class="vp-drag-material__label">{{ item.label }}</span
          ><span class="vp-drag-material__meta"
            ><span>{{ item.type }}</span
            ><span v-if="item.group">{{ item.group }}</span></span
          ></slot
        >
      </li>
    </ul>
    <div v-else class="vp-drag-material__empty" role="status">
      <slot name="empty">{{ emptyText ?? t("common.noData") }}</slot>
    </div>
    <slot name="footer" :count="list.length" />
  </aside>
</template>
