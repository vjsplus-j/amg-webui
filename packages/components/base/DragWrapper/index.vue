<script setup lang="ts">
import { computed, ref } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import { LocaleKeys } from "@amg-webui/locale";
import type { DragWrapperProps, DragWrapperEmits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<DragWrapperProps>(), {
  label: "",
  nested: true,
  loading: false,
  disabled: false,
  accept: () => ["application/vp-material-type"],
  telemetry: undefined,
});
const emit = defineEmits<DragWrapperEmits>();
const { t } = useLocale();
const titleText = computed(
  () => props.title ?? (props.label || t("component.drag-wrapper.title")),
);
const dragDepth = ref(0);
const active = computed(() => dragDepth.value > 0);

function onDrop(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  if (props.disabled) return;
  dragDepth.value = 0;
  const mime =
    props.accept.find((item) => e.dataTransfer?.types.includes(item)) ??
    props.accept[0];
  const data = mime ? (e.dataTransfer?.getData(mime) ?? "") : "";
  if (data) {
    emit("drop", data);
    emit("dropData", { type: mime, data, event: e });
    trackEmit({
      component: "DragWrapper",
      type: "drop",
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { type: mime },
    });
  }
}
function onDragOver(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
}
function onDragEnter(e: DragEvent) {
  e.preventDefault();
  dragDepth.value++;
  emit("dragEnter", e);
}
function onDragLeave(e: DragEvent) {
  dragDepth.value = Math.max(0, dragDepth.value - 1);
  emit("dragLeave", e);
}
function clearZone() {
  if (!props.disabled) {
    emit("clear");
    trackEmit({
      component: "DragWrapper",
      type: "clear",
      trackId: props.trackId,
      telemetry: props.telemetry,
    });
  }
}
</script>

<template>
  <section
    :class="[
      'vp-drag-wrapper',
      {
        'vp-drag-wrapper--nested': nested,
        'vp-drag-wrapper--active': active,
        'vp-drag-wrapper--disabled': disabled,
      },
      props.class,
    ]"
    :style="style"
    role="region"
    aria-labelledby="vp-drag-wrapper-title"
    :aria-disabled="disabled"
    data-component="DragWrapper"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <header class="vp-drag-wrapper__header">
      <h3 id="vp-drag-wrapper-title" class="vp-drag-wrapper__title">
        {{ titleText }}
      </h3>
    </header>
    <div v-if="loading" class="vp-drag-wrapper__loading" role="status">
      {{ t(LocaleKeys.common.loading) }}
    </div>
    <div v-else class="vp-drag-wrapper__body">
      <div class="vp-drag-wrapper__slot"><slot /></div>
      <p v-if="!$slots.default" class="vp-drag-wrapper__empty">
        {{ t("component.drag-wrapper.hint") }}
      </p>
      <button
        type="button"
        class="vp-drag-wrapper__btn vp-drag-wrapper__btn--ghost"
        :disabled="disabled"
        @click="clearZone"
      >
        {{ t(LocaleKeys.button.reset) }}
      </button>
    </div>
  </section>
</template>
