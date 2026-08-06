<script setup lang="ts">
import { computed } from "vue";
import type { CardGridEmits, CardGridProps } from "./types";
import { useCardGridLayout } from "./useCardGridLayout";
import { useLocale } from "@amg-webui/hooks";
import "./style.scss";

const props = withDefaults(defineProps<CardGridProps>(), {
  minTrack: "md",
  fit: "fill",
  gap: "lg",
  equalHeight: true,
  as: "div",
  loading: false,
  skeletonCount: 3,
  empty: false,
});

const emit = defineEmits<CardGridEmits>();
const { columns: cols, rootStyle } = useCardGridLayout(props, emit);
const { t } = useLocale();
const resolvedEmptyText = computed(() => props.emptyText ?? t("common.noData"));

const rootClass = computed(() => [
  "vp-card-grid",
  {
    "vp-card-grid--equal": props.equalHeight,
  },
  props.class,
]);

</script>

<template>
  <component
    :is="as"
    :class="rootClass"
    :style="rootStyle"
    data-component="CardGrid"
    role="list"
    :aria-label="ariaLabel"
    :aria-busy="loading || undefined"
  >
    <template v-if="loading">
      <div
        v-for="index in Math.max(1, skeletonCount)"
        :key="index"
        class="vp-card-grid__skeleton"
        role="listitem"
        aria-hidden="true"
      />
    </template>
    <div v-else-if="empty" class="vp-card-grid__empty" role="status">
      <slot name="empty">{{ resolvedEmptyText }}</slot>
    </div>
    <slot v-else :columns="cols" />
  </component>
</template>
