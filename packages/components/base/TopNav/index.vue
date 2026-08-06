<script setup lang="ts">
import { computed, ref } from "vue";
import { useNavSelection } from "@amg-webui/utils/nav";
import Icon from "../Icon/index.vue";
import type { TopNavEmits, TopNavProps } from "./types";
import "./style.scss";
const props = withDefaults(defineProps<TopNavProps>(), {
  items: () => [],
  direction: "horizontal",
  disabled: false,
  telemetry: undefined,
});
const emit = defineEmits<TopNavEmits>();
const rootRef = ref<HTMLElement | null>(null);
const { selectItem, isActive } = useNavSelection(props, emit, "TopNav");
const rootClass = computed(() => [
  "vp-top-nav",
  `vp-top-nav--${props.direction}`,
  { "vp-top-nav--disabled": props.disabled },
  props.class,
]);
function onKeydown(event: KeyboardEvent, index: number) {
  const keys =
    props.direction === "horizontal"
      ? ["ArrowLeft", "ArrowRight"]
      : ["ArrowUp", "ArrowDown"];
  if (![...keys, "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const enabled = props.items
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => !item.disabled);
  const current = enabled.findIndex((entry) => entry.i === index);
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? enabled.length - 1
        : event.key === keys[0]
          ? (current - 1 + enabled.length) % enabled.length
          : (current + 1) % enabled.length;
  rootRef.value
    ?.querySelectorAll<HTMLButtonElement>(".vp-top-nav__item")
    [enabled[next]?.i]?.focus();
}
</script>
<template>
  <nav ref="rootRef" :class="rootClass" :style="style" data-component="TopNav">
    <button
      v-for="(item, i) in items"
      :key="item.value ?? item.label ?? i"
      type="button"
      :class="[
        'vp-top-nav__item',
        { 'vp-top-nav__item--active': isActive(item) },
      ]"
      :disabled="disabled || item.disabled"
      :aria-current="isActive(item) ? 'page' : undefined"
      @click="selectItem(item, $event)"
      @keydown="onKeydown($event, i)"
    >
      <Icon v-if="item.icon" :name="item.icon" size="sm" /><span>{{
        item.label
      }}</span
      ><small v-if="item.badge != null" class="vp-top-nav__badge">{{
        item.badge
      }}</small></button
    ><slot />
  </nav>
</template>
