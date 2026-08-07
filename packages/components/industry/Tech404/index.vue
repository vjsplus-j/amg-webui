<script setup lang="ts">
import { computed } from "vue";
import { useLocale, useNotFoundActions } from "@amg-webui/hooks";
import type { Tech404Props, Tech404Emits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<Tech404Props>(), {
  code: 404,
  actions: () => [],
  disabled: false,
  loading: false,
  retryable: false,
  telemetry: undefined,
});
const emit = defineEmits<Tech404Emits>();
const { t } = useLocale();
const titleText = computed(() => props.title ?? t("error.notFound"));
const leadText = computed(
  () => props.description ?? t("component.tech404.lead"),
);
const rootClass = computed(() => [
  "vp-tech404",
  "vp-tech404__panel",
  {
    "vp-tech404--disabled": props.disabled,
    "vp-tech404--loading": props.loading,
  },
  props.class,
]);
const { resolvedActions, runAction, retry, goHome } = useNotFoundActions(
  "Tech404",
  props,
  emit as never,
  () => t("button.continue"),
);
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    data-component="Tech404"
    data-variant="tech404"
    role="status"
    :aria-busy="loading || undefined"
  >
    <div class="vp-tech404__body">
      <p class="vp-tech404__code" aria-hidden="true">{{ code }}</p>
      <h1 class="vp-tech404__title">{{ titleText }}</h1>
      <p class="vp-tech404__muted">{{ leadText }}</p>
      <div class="vp-tech404__toolbar">
        <slot :actions="resolvedActions" :retry="retry">
          <button
            v-for="action in resolvedActions"
            :key="action.key"
            type="button"
            class="vp-tech404__action"
            :class="{ 'vp-tech404__action--active': modelValue === action.key }"
            :disabled="disabled || loading || action.disabled"
            @click="runAction(action, $event)"
          >
            {{ action.label }}
          </button>
          <a
            v-if="homeHref"
            class="vp-tech404__action vp-tech404__action--ghost"
            :href="homeHref"
            @click="goHome"
            >{{ homeText ?? t("button.continue") }}</a
          >
          <button
            v-if="retryable"
            type="button"
            class="vp-tech404__action vp-tech404__action--ghost"
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
