<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useCanvasEditor, useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import { LocaleKeys } from "@amg-webui/locale";
import type { FreeLayoutDragProps, FreeLayoutDragEmits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<FreeLayoutDragProps>(), {
  enabled: true,
  loading: false,
  disabled: false,
  modelValue: () => ({ x: 0, y: 0 }),
  draggable: true,
  axis: "both",
  constrainToParent: true,
  telemetry: undefined,
});
const emit = defineEmits<FreeLayoutDragEmits>();
const { t } = useLocale();
const editor = useCanvasEditor();
const on = ref(props.enabled);
const rootRef = ref<HTMLElement | null>(null);
const position = ref({ ...props.modelValue });
const dragging = ref(false);
let origin = { pointerX: 0, pointerY: 0, x: 0, y: 0 };
const titleText = computed(
  () => props.title ?? t("component.free-layout-drag.title"),
);

watch(
  () => props.enabled,
  (value) => {
    on.value = value;
    if (value && editor) {
      editor.mode.value = "free";
      emit("mode", "free");
    }
  },
  { immediate: true },
);
watch(
  () => props.modelValue,
  (value) => {
    position.value = { ...value };
  },
  { deep: true },
);

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  transform: `translate3d(${position.value.x}px, ${position.value.y}px, 0)`,
}));
const stateText = computed(() =>
  on.value ? props.activeText : props.inactiveText,
);

function toggle() {
  if (props.disabled) return;
  on.value = !on.value;
  if (on.value && editor) editor.mode.value = "free";
  emit("toggle", on.value);
  emit("update:enabled", on.value);
  trackEmit({
    component: "FreeLayoutDrag",
    type: "toggle",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { enabled: on.value },
  });
}

function clampPosition(next: { x: number; y: number }) {
  if (!props.constrainToParent || !rootRef.value?.parentElement) return next;
  const parent = rootRef.value.parentElement.getBoundingClientRect();
  const own = rootRef.value.getBoundingClientRect();
  return {
    x: Math.min(Math.max(0, next.x), Math.max(0, parent.width - own.width)),
    y: Math.min(Math.max(0, next.y), Math.max(0, parent.height - own.height)),
  };
}

function updatePosition(next: { x: number; y: number }, event: PointerEvent) {
  const resolved = clampPosition({
    x: props.axis === "y" ? position.value.x : next.x,
    y: props.axis === "x" ? position.value.y : next.y,
  });
  position.value = resolved;
  emit("update:modelValue", resolved);
  emit("drag", resolved, event);
}

function onPointerDown(event: PointerEvent) {
  if (
    !on.value ||
    props.disabled ||
    props.loading ||
    !props.draggable ||
    event.button !== 0
  )
    return;
  dragging.value = true;
  origin = {
    pointerX: event.clientX,
    pointerY: event.clientY,
    ...position.value,
  };
  (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  emit("drag-start", position.value, event);
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return;
  updatePosition(
    {
      x: origin.x + event.clientX - origin.pointerX,
      y: origin.y + event.clientY - origin.pointerY,
    },
    event,
  );
}

function onPointerUp(event: PointerEvent) {
  if (!dragging.value) return;
  dragging.value = false;
  emit("change", position.value);
  emit("drag-end", position.value, event);
  trackEmit({
    component: "FreeLayoutDrag",
    type: "drag-end",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: position.value,
  });
}
</script>

<template>
  <section
    ref="rootRef"
    :class="[
      'vp-free-layout-drag',
      {
        'vp-free-layout-drag--active': on,
        'vp-free-layout-drag--dragging': dragging,
        'vp-free-layout-drag--disabled': disabled,
      },
      props.class,
    ]"
    :style="rootStyle"
    role="region"
    aria-labelledby="vp-free-layout-drag-title"
    :aria-busy="loading || undefined"
    data-component="FreeLayoutDrag"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <header
      class="vp-free-layout-drag__header"
      :class="{ 'vp-free-layout-drag__header--handle': draggable }"
      @pointerdown="onPointerDown"
    >
      <h3 id="vp-free-layout-drag-title" class="vp-free-layout-drag__title">
        {{ titleText }}
      </h3>
      <span
        class="vp-free-layout-drag__badge"
        :class="
          on
            ? 'vp-free-layout-drag__badge--on'
            : 'vp-free-layout-drag__badge--off'
        "
        aria-hidden="true"
      />
      <span v-if="stateText" class="vp-free-layout-drag__state">{{
        stateText
      }}</span>
    </header>
    <div v-if="loading" class="vp-free-layout-drag__loading" role="status">
      {{ t(LocaleKeys.common.loading) }}
    </div>
    <div v-else class="vp-free-layout-drag__body">
      <slot :position="position" :dragging="dragging" /><button
        type="button"
        class="vp-free-layout-drag__btn vp-free-layout-drag__btn--ghost"
        :disabled="disabled"
        :aria-pressed="on"
        @click="toggle"
      >
        {{ t(LocaleKeys.button.confirm) }}
      </button>
    </div>
  </section>
</template>
