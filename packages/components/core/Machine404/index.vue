<script setup lang="ts">
import { computed } from "vue";
import { useLocale, useNotFoundActions } from "@amg-webui/hooks";
import type { Machine404Props, Machine404Emits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<Machine404Props>(), {
  code: 404,
  actions: () => [],
  disabled: false,
  loading: false,
  retryable: false,
  telemetry: undefined,
});
const emit = defineEmits<Machine404Emits>();
const { t } = useLocale();
const titleText = computed(() => props.title ?? t("error.notFound"));
const leadText = computed(
  () => props.description ?? t("component.machine404.lead"),
);
const rootClass = computed(() => [
  "vp-machine404",
  "vp-machine404__panel",
  {
    "vp-machine404--disabled": props.disabled,
    "vp-machine404--loading": props.loading,
  },
  props.class,
]);
const { resolvedActions, runAction, retry, goHome } = useNotFoundActions(
  "Machine404",
  props,
  emit as never,
  () => t("button.continue"),
);
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    data-component="Machine404"
    data-variant="machine404"
    role="status"
    :aria-busy="loading || undefined"
  >
    <div class="vp-machine404__body">
      <p class="vp-machine404__gear" aria-hidden="true">⚙</p>
      <p class="vp-machine404__code" aria-hidden="true">{{ code }}</p>
      <h1 class="vp-machine404__title">{{ titleText }}</h1>
      <p class="vp-machine404__muted">{{ leadText }}</p>
      <div class="vp-machine404__toolbar">
        <slot :actions="resolvedActions" :retry="retry">
          <button
            v-for="action in resolvedActions"
            :key="action.key"
            type="button"
            class="vp-machine404__action"
            :disabled="disabled || loading || action.disabled"
            @click="runAction(action, $event)"
          >
            {{ action.label }}
          </button>
          <a
            v-if="homeHref"
            class="vp-machine404__action vp-machine404__action--ghost"
            :href="homeHref"
            @click="goHome"
            >{{ homeText ?? t("button.continue") }}</a
          >
          <button
            v-if="retryable"
            type="button"
            class="vp-machine404__action vp-machine404__action--ghost"
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
