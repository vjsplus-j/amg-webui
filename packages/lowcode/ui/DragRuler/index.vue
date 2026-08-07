<script setup lang="ts">
import { computed, ref } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import { LocaleKeys } from "@amg-webui/locale";
import type { DragRulerProps, DragRulerEmits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<DragRulerProps>(), {
  scale: 1,
  showGuides: true,
  loading: false,
  disabled: false,
  telemetry: undefined,
});
const emit = defineEmits<DragRulerEmits>();
const { t } = useLocale();
const guides = ref(props.showGuides);
const titleText = computed(
  () => props.title ?? t("component.drag-ruler.title"),
);
const ticks = computed(() =>
  Array.from({ length: 25 }, (_, i) => i * 10 * props.scale),
);

function toggleGuides() {
  if (props.disabled) return;
  guides.value = !guides.value;
  emit("toggle-guides", guides.value);
  trackEmit({
    component: "DragRuler",
    type: "toggle-guides",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
</script>

<template>
  <section
    :class="['vp-drag-ruler', 'vp-drag-ruler__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-drag-ruler-title"
    data-component="DragRuler"
  >
    <header class="vp-drag-ruler__header">
      <h3 id="vp-drag-ruler-title" class="vp-drag-ruler__title">
        {{ titleText }}
      </h3>
      <div class="vp-drag-ruler__status" role="status"></div>
    </header>
    <div v-if="loading" class="vp-drag-ruler__loading" role="status">
      {{ t(LocaleKeys.common.loading) }}
    </div>
    <div v-else class="vp-drag-ruler__body">
      <div class="vp-drag-ruler__h">
        <span
          v-for="tick in ticks"
          :key="'h' + tick"
          class="vp-drag-ruler__tick"
          >{{ tick }}</span
        >
      </div>
      <div class="vp-drag-ruler__v">
        <span
          v-for="tick in ticks"
          :key="'v' + tick"
          class="vp-drag-ruler__tick"
          >{{ tick }}</span
        >
      </div>
      <div v-if="guides" class="vp-drag-ruler__guides"><slot /></div>
      <div class="vp-drag-ruler__toolbar">
        <button
          type="button"
          class="vp-drag-ruler__btn vp-drag-ruler__btn--ghost"
          :disabled="disabled"
          @click="toggleGuides"
        >
          {{ t(LocaleKeys.button.confirm) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
