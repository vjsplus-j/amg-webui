<script setup lang="ts">
import { computed } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import type { EmbedLayoutEmits, EmbedLayoutProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<EmbedLayoutProps>(), {
  aspectRatio: "16 / 9",
  fill: false,
  rounded: true,
  bordered: true,
  objectFit: "cover",
  loading: false,
  disabled: false,
  interactive: false,
  as: "figure",
  telemetry: undefined,
});
const emit = defineEmits<EmbedLayoutEmits>();
const { t } = useLocale();
const presets: Record<string, string> = {
  "16/9": "16 / 9",
  "4/3": "4 / 3",
  "1/1": "1 / 1",
  "21/9": "21 / 9",
  "3/2": "3 / 2",
  "9/16": "9 / 16",
};
const resolvedAspect = computed(() => {
  const raw = String(props.aspectRatio).replace(/\s/g, "");
  return presets[raw] ?? props.aspectRatio;
});
const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  "--vp-embed-fit": props.objectFit,
  aspectRatio: props.fill ? undefined : resolvedAspect.value,
}));
function activate(event: MouseEvent | KeyboardEvent) {
  if (!props.interactive || props.disabled || props.loading) return;
  if (event instanceof KeyboardEvent) event.preventDefault();
  emit("frame-click", event);
  trackEmit({
    component: "EmbedLayout",
    type: "frameClick",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
</script>

<template>
  <component
    :is="as"
    :class="[
      'vp-embed-layout',
      `vp-embed-layout--fit-${objectFit}`,
      {
        'vp-embed-layout--rounded': rounded,
        'vp-embed-layout--bordered': bordered,
        'vp-embed-layout--fill': fill,
        'vp-embed-layout--interactive': interactive && !disabled,
        'vp-embed-layout--disabled': disabled,
      },
      props.class,
    ]"
    :style="rootStyle"
    :role="interactive ? 'button' : as === 'figure' ? undefined : 'figure'"
    :tabindex="interactive && !disabled ? 0 : undefined"
    :aria-label="label"
    :aria-busy="loading"
    data-component="EmbedLayout"
    @click="activate"
    @keydown.enter="activate"
    @keydown.space="activate"
  >
    <div class="vp-embed-layout__frame">
      <slot />
      <div v-if="loading" class="vp-embed-layout__loading" role="status">
        <slot name="loading">{{ t("common.loading") }}</slot>
      </div>
      <slot name="overlay" />
    </div>
    <figcaption
      v-if="caption || $slots.caption"
      class="vp-embed-layout__caption"
    >
      <slot name="caption">{{ caption }}</slot>
    </figcaption>
  </component>
</template>
