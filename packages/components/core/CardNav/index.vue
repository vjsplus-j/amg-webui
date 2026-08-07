<script setup lang="ts">
import { computed } from "vue";
import { useNavSelection } from "@amg-webui/utils/nav";
import { useLocale } from "@amg-webui/hooks";
import type { CardNavEmits, CardNavProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<CardNavProps>(), {
  items: () => [],
  direction: "horizontal",
  disabled: false,
  telemetry: undefined,
});

const emit = defineEmits<CardNavEmits>();
const { t } = useLocale();

const { selectItem, isActive } = useNavSelection(props, emit, "CardNav");

const rootClass = computed(() => [
  "vp-card-nav",
  `vp-card-nav--${props.direction}`,
  { "vp-card-nav--disabled": props.disabled },
  props.class,
]);
const emptyLabel = computed(() => props.emptyText ?? t("common.noData"));
</script>

<template>
  <nav
    :class="rootClass"
    :style="style"
    data-component="CardNav"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
  >
    <button
      v-for="(item, i) in items"
      :key="item.value ?? item.label ?? i"
      type="button"
      :class="[
        'vp-card-nav__card',
        { 'vp-card-nav__card--active': isActive(item) },
      ]"
      :disabled="disabled || item.disabled"
      @click="selectItem(item, $event)"
    >
      <span v-if="item.icon" class="vp-card-nav__icon" aria-hidden="true">{{
        item.icon
      }}</span>
      <span class="vp-card-nav__content">
        <span class="vp-card-nav__label">{{ item.label }}</span>
        <span v-if="item.description" class="vp-card-nav__description">{{
          item.description
        }}</span>
      </span>
      <span v-if="item.badge != null" class="vp-card-nav__badge">{{
        item.badge
      }}</span>
    </button>
    <p v-if="!items.length" class="vp-card-nav__empty" role="status">
      <slot name="empty">{{ emptyLabel }}</slot>
    </p>
  </nav>
</template>
