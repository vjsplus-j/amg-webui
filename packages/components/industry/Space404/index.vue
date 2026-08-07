<script setup lang="ts">
import { computed } from "vue";
import { useLocale, useNotFoundActions } from "@amg-webui/hooks";
import type { Space404Props, Space404Emits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<Space404Props>(), {
  code: 404,
  actions: () => [],
  disabled: false,
  loading: false,
  retryable: false,
  telemetry: undefined,
});
const emit = defineEmits<Space404Emits>();
const { t } = useLocale();
const titleText = computed(() => props.title ?? t("error.notFound"));
const leadText = computed(
  () => props.description ?? t("component.space404.lead"),
);
const rootClass = computed(() => [
  "vp-space404",
  "vp-space404__panel",
  {
    "vp-space404--disabled": props.disabled,
    "vp-space404--loading": props.loading,
  },
  props.class,
]);
const { resolvedActions, runAction, retry, goHome } = useNotFoundActions(
  "Space404",
  props,
  emit as never,
  () => t("button.continue"),
);
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    data-component="Space404"
    data-variant="space404"
    role="status"
    :aria-busy="loading || undefined"
  >
    <div class="vp-space404__body">
      <div class="vp-space404__stars" aria-hidden="true" />
      <p class="vp-space404__code" aria-hidden="true">{{ code }}</p>
      <h1 class="vp-space404__title">{{ titleText }}</h1>
      <p class="vp-space404__muted">{{ leadText }}</p>
      <div class="vp-space404__toolbar">
        <slot :actions="resolvedActions" :retry="retry">
          <button
            v-for="action in resolvedActions"
            :key="action.key"
            type="button"
            class="vp-space404__action"
            :disabled="disabled || loading || action.disabled"
            @click="runAction(action, $event)"
          >
            {{ action.label }}
          </button>
          <a
            v-if="homeHref"
            class="vp-space404__action vp-space404__action--ghost"
            :href="homeHref"
            @click="goHome"
            >{{ homeText ?? t("button.continue") }}</a
          >
          <button
            v-if="retryable"
            type="button"
            class="vp-space404__action vp-space404__action--ghost"
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
