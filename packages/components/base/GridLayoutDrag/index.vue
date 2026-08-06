<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { useCanvasEditor } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import { LocaleKeys } from "@amg-webui/locale";
import type { GridLayoutDragProps, GridLayoutDragEmits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<GridLayoutDragProps>(), {
  cols: 24,
  enabled: true,
  loading: false,
  disabled: false,
  telemetry: undefined,
});
const emit = defineEmits<GridLayoutDragEmits>();
const { t } = useLocale();
const editor = useCanvasEditor();
const on = ref(props.enabled);
const titleText = computed(
  () => props.title ?? t("component.grid-layout-drag.title"),
);
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.cols}, 1fr)`,
}));

watch(
  () => props.enabled,
  (v) => {
    on.value = v;
    if (v && editor) {
      editor.mode.value = "grid";
      emit("mode", "grid");
    }
  },
  { immediate: true },
);

function toggle() {
  if (props.disabled) return;
  on.value = !on.value;
  emit("update:enabled", on.value);
  if (on.value && editor) editor.mode.value = "grid";
  emit("toggle", on.value);
  trackEmit({
    component: "GridLayoutDrag",
    type: "toggle",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
</script>

<template>
  <section
    :class="[
      'vp-grid-layout-drag',
      { 'vp-grid-layout-drag--active': on },
      props.class,
    ]"
    :style="[gridStyle, style]"
    role="region"
    aria-labelledby="vp-grid-layout-drag-title"
    data-component="GridLayoutDrag"
  >
    <header class="vp-grid-layout-drag__header">
      <h3 id="vp-grid-layout-drag-title" class="vp-grid-layout-drag__title">
        {{ titleText }}
      </h3>
    </header>
    <div v-if="loading" class="vp-grid-layout-drag__loading" role="status">
      {{ t(LocaleKeys.common.loading) }}
    </div>
    <div v-else class="vp-grid-layout-drag__body">
      <slot :enabled="on" :toggle="toggle" /><button
        type="button"
        class="vp-grid-layout-drag__btn vp-grid-layout-drag__btn--ghost"
        :disabled="disabled"
        :aria-pressed="on"
        :aria-label="titleText"
        @click="toggle"
      >
        <span aria-hidden="true">{{ on ? "✓" : "○" }}</span>
      </button>
    </div>
  </section>
</template>
