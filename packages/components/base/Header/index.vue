<script setup lang="ts">
import { computed } from "vue";
import type { HeaderPadding, HeaderProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<HeaderProps>(), {
  sticky: false,
  fixed: false,
  bordered: true,
  size: "md",
  padding: "page",
  translucent: true,
  elevated: false,
  centered: false,
  as: "header",
});

const padMap: Record<HeaderPadding, string> = {
  none: "0",
  xs: "var(--spacing-xs)",
  sm: "var(--spacing-sm)",
  md: "var(--spacing-md)",
  lg: "var(--spacing-lg)",
  page: "var(--vp-layout-chrome-pad-x, var(--theme-page-pad))",
};

const rootClass = computed(() => [
  "vp-header",
  `vp-header--${props.size}`,
  `vp-header--pad-${props.padding}`,
  {
    "vp-header--sticky": props.sticky && !props.fixed,
    "vp-header--fixed": props.fixed,
    "vp-header--bordered": props.bordered,
    "vp-header--translucent": props.translucent,
    "vp-header--solid": !props.translucent,
    "vp-header--elevated": props.elevated,
    "vp-header--centered": props.centered,
  },
  props.class,
]);

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  "--vp-header-pad-x": padMap[props.padding] ?? padMap.page,
}));
</script>

<template>
  <component
    :is="as"
    :class="rootClass"
    :style="rootStyle"
    data-component="Header"
    :role="as === 'header' ? undefined : 'banner'"
    :aria-label="ariaLabel"
  >
    <div v-if="$slots.start" class="vp-header__start">
      <slot name="start" />
    </div>
    <div
      v-if="title || subtitle || $slots.title || $slots.default"
      class="vp-header__heading"
    >
      <div class="vp-header__title">
        <slot name="title">
          <span v-if="title">{{ title }}</span>
          <slot v-else />
        </slot>
      </div>
      <p v-if="subtitle || $slots.subtitle" class="vp-header__subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>
    </div>
    <div v-if="$slots.extra" class="vp-header__extra">
      <slot name="extra" />
    </div>
    <div v-if="$slots.actions" class="vp-header__actions">
      <slot name="actions" />
    </div>
    <div v-if="$slots.end" class="vp-header__end">
      <slot name="end" />
    </div>
  </component>
</template>
