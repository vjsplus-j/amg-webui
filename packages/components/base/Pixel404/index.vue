<script setup lang="ts">
import { computed } from "vue";
import { useLocale, useNotFoundActions } from "@amg-webui/hooks";
import type { Pixel404Props, Pixel404Emits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<Pixel404Props>(), {
  code: 404,
  actions: () => [],
  disabled: false,
  loading: false,
  retryable: false,
  telemetry: undefined,
});
const emit = defineEmits<Pixel404Emits>();
const { t } = useLocale();
const titleText = computed(() => props.title ?? t("error.notFound"));
const leadText = computed(
  () => props.description ?? t("component.pixel404.lead"),
);
const rootClass = computed(() => [
  "vp-pixel404",
  "vp-pixel404__panel",
  {
    "vp-pixel404--disabled": props.disabled,
    "vp-pixel404--loading": props.loading,
  },
  props.class,
]);
const { resolvedActions, runAction, retry, goHome } = useNotFoundActions(
  "Pixel404",
  props,
  emit as never,
  () => t("button.continue"),
);
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    data-component="Pixel404"
    data-variant="pixel404"
    role="status"
    :aria-busy="loading || undefined"
  >
    <div class="vp-pixel404__body">
      <div class="vp-pixel404__grid" aria-hidden="true">
        <span class="vp-pixel404__pixel" /><span
          class="vp-pixel404__pixel"
        /><span class="vp-pixel404__pixel" /><span
          class="vp-pixel404__pixel"
        /><span class="vp-pixel404__pixel vp-pixel404__pixel--off" /><span
          class="vp-pixel404__pixel"
        /><span class="vp-pixel404__pixel" /><span
          class="vp-pixel404__pixel vp-pixel404__pixel--off"
        /><span class="vp-pixel404__pixel" />
      </div>
      <p class="vp-pixel404__code" aria-hidden="true">{{ code }}</p>
      <h1 class="vp-pixel404__title">{{ titleText }}</h1>
      <p class="vp-pixel404__muted">{{ leadText }}</p>
      <div class="vp-pixel404__toolbar">
        <slot :actions="resolvedActions" :retry="retry">
          <button
            v-for="action in resolvedActions"
            :key="action.key"
            type="button"
            class="vp-pixel404__action"
            :disabled="disabled || loading || action.disabled"
            @click="runAction(action, $event)"
          >
            {{ action.label }}
          </button>
          <a
            v-if="homeHref"
            class="vp-pixel404__action vp-pixel404__action--ghost"
            :href="homeHref"
            @click="goHome"
            >{{ homeText ?? t("button.continue") }}</a
          >
          <button
            v-if="retryable"
            type="button"
            class="vp-pixel404__action vp-pixel404__action--ghost"
            :disabled="disabled || loading"
            @click="retry"
          >
            {{ t("button.refresh") }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
