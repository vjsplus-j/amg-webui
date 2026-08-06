<script setup lang="ts">
import { computed } from "vue";
import { useLocale, useNotFoundActions } from "@amg-webui/hooks";
import type { Cartoon404Props, Cartoon404Emits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<Cartoon404Props>(), {
  code: 404,
  actions: () => [],
  disabled: false,
  loading: false,
  retryable: false,
  telemetry: undefined,
});
const emit = defineEmits<Cartoon404Emits>();
const { t } = useLocale();
const titleText = computed(() => props.title ?? t("error.notFound"));
const leadText = computed(
  () => props.description ?? t("component.cartoon404.lead"),
);
const rootClass = computed(() => [
  "vp-cartoon404",
  "vp-cartoon404__panel",
  {
    "vp-cartoon404--disabled": props.disabled,
    "vp-cartoon404--loading": props.loading,
  },
  props.class,
]);
const { resolvedActions, runAction, retry, goHome } = useNotFoundActions(
  "Cartoon404",
  props,
  emit as never,
  () => t("button.continue"),
);
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    data-component="Cartoon404"
    data-variant="cartoon404"
    role="status"
    :aria-busy="loading || undefined"
  >
    <div class="vp-cartoon404__body">
      <div class="vp-cartoon404__art" aria-hidden="true">
        <span class="vp-cartoon404__blob vp-cartoon404__blob--a" /><span
          class="vp-cartoon404__blob vp-cartoon404__blob--b"
        /><span class="vp-cartoon404__code">{{ code }}</span>
      </div>
      <h1 class="vp-cartoon404__title">{{ titleText }}</h1>
      <p class="vp-cartoon404__muted">{{ leadText }}</p>
      <div class="vp-cartoon404__toolbar">
        <slot :actions="resolvedActions" :retry="retry">
          <button
            v-for="action in resolvedActions"
            :key="action.key"
            type="button"
            class="vp-cartoon404__action"
            :class="{
              'vp-cartoon404__action--active': modelValue === action.key,
            }"
            :disabled="disabled || loading || action.disabled"
            @click="runAction(action, $event)"
          >
            {{ action.label }}
          </button>
          <a
            v-if="homeHref"
            class="vp-cartoon404__action vp-cartoon404__action--ghost"
            :href="homeHref"
            @click="goHome"
            >{{ homeText ?? t("button.continue") }}</a
          >
          <button
            v-if="retryable"
            type="button"
            class="vp-cartoon404__action vp-cartoon404__action--ghost"
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
