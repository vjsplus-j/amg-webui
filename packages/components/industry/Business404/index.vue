<script setup lang="ts">
import { computed } from "vue";
import { useLocale, useNotFoundActions } from "@amg-webui/hooks";
import type { Business404Props, Business404Emits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<Business404Props>(), {
  code: 404,
  actions: () => [],
  disabled: false,
  loading: false,
  retryable: false,
  telemetry: undefined,
});
const emit = defineEmits<Business404Emits>();
const { t } = useLocale();
const titleText = computed(() => props.title ?? t("error.notFound"));
const leadText = computed(
  () => props.description ?? t("component.business404.lead"),
);
const rootClass = computed(() => [
  "vp-business404",
  "vp-business404__panel",
  {
    "vp-business404--disabled": props.disabled,
    "vp-business404--loading": props.loading,
  },
  props.class,
]);
const { resolvedActions, runAction, retry, goHome } = useNotFoundActions(
  "Business404",
  props,
  emit as never,
  () => t("button.continue"),
);
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    data-component="Business404"
    data-variant="business404"
    role="status"
    :aria-busy="loading || undefined"
  >
    <div class="vp-business404__body">
      <div class="vp-business404__bars" aria-hidden="true">
        <span
          v-for="bar in 4"
          :key="bar"
          class="vp-business404__bar"
          :class="`vp-business404__bar--${bar}`"
        />
      </div>
      <p class="vp-business404__code" aria-hidden="true">{{ code }}</p>
      <h1 class="vp-business404__title">{{ titleText }}</h1>
      <p class="vp-business404__muted">{{ leadText }}</p>
      <div class="vp-business404__toolbar">
        <slot :actions="resolvedActions" :retry="retry">
          <button
            v-for="action in resolvedActions"
            :key="action.key"
            type="button"
            class="vp-business404__action"
            :class="{
              'vp-business404__action--active': modelValue === action.key,
            }"
            :disabled="disabled || loading || action.disabled"
            @click="runAction(action, $event)"
          >
            {{ action.label }}
          </button>
          <a
            v-if="homeHref"
            class="vp-business404__action vp-business404__action--ghost"
            :href="homeHref"
            @click="goHome"
            >{{ homeText ?? t("button.continue") }}</a
          >
          <button
            v-if="retryable"
            type="button"
            class="vp-business404__action vp-business404__action--ghost"
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
