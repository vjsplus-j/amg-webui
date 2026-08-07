<script setup lang="ts">
import { computed } from "vue";
import { useLocale, useNotFoundActions } from "@amg-webui/hooks";
import type { Plant404Props, Plant404Emits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<Plant404Props>(), {
  code: 404,
  actions: () => [],
  disabled: false,
  loading: false,
  retryable: false,
  telemetry: undefined,
});
const emit = defineEmits<Plant404Emits>();
const { t } = useLocale();
const titleText = computed(() => props.title ?? t("error.notFound"));
const leadText = computed(
  () => props.description ?? t("component.plant404.lead"),
);
const rootClass = computed(() => [
  "vp-plant404",
  "vp-plant404__panel",
  {
    "vp-plant404--disabled": props.disabled,
    "vp-plant404--loading": props.loading,
  },
  props.class,
]);
const { resolvedActions, runAction, retry, goHome } = useNotFoundActions(
  "Plant404",
  props,
  emit as never,
  () => t("button.continue"),
);
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    data-component="Plant404"
    data-variant="plant404"
    role="status"
    :aria-busy="loading || undefined"
  >
    <div class="vp-plant404__body">
      <div class="vp-plant404__leaf" aria-hidden="true" />
      <p class="vp-plant404__code" aria-hidden="true">{{ code }}</p>
      <h1 class="vp-plant404__title">{{ titleText }}</h1>
      <p class="vp-plant404__muted">{{ leadText }}</p>
      <div class="vp-plant404__toolbar">
        <slot :actions="resolvedActions" :retry="retry">
          <button
            v-for="action in resolvedActions"
            :key="action.key"
            type="button"
            class="vp-plant404__action"
            :disabled="disabled || loading || action.disabled"
            @click="runAction(action, $event)"
          >
            {{ action.label }}
          </button>
          <a
            v-if="homeHref"
            class="vp-plant404__action vp-plant404__action--ghost"
            :href="homeHref"
            @click="goHome"
            >{{ homeText ?? t("button.continue") }}</a
          >
          <button
            v-if="retryable"
            type="button"
            class="vp-plant404__action vp-plant404__action--ghost"
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
