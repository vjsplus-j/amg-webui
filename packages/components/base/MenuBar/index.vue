<script setup lang="ts">
import { computed } from "vue";
import Menu from "../Menu/index.vue";
import type { MenuItem } from "../Menu/types";
import { trackEmit } from "@amg-webui/telemetry";
import type { MenuBarItem, MenuBarProps } from "./types";
import "./style.scss";

/**
 * Thin horizontal Menu wrapper (popup flyouts via Menu mode=auto).
 */
const props = withDefaults(defineProps<MenuBarProps>(), {
  items: () => [],
  telemetry: undefined,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "command", command: string, item: MenuBarItem): void;
  (e: "change", value: string): void;
}>();

function mapItems(list: MenuBarItem[]): MenuItem[] {
  return list
    .filter((item) => !item.divider)
    .map((item) => ({
      key: item.command || item.label,
      label: item.label,
      icon: item.icon,
      disabled: item.disabled,
      children: item.children?.length ? mapItems(item.children) : undefined,
    }));
}

function findBarItem(
  list: MenuBarItem[],
  key: string,
): MenuBarItem | undefined {
  for (const item of list) {
    if (item.divider) continue;
    if ((item.command || item.label) === key) return item;
    if (item.children?.length) {
      const hit = findBarItem(item.children, key);
      if (hit) return hit;
    }
  }
  return undefined;
}

const menuItems = computed(() => mapItems(props.items ?? []));

const rootClass = computed(() => ["vp-menubar", props.class]);

function onModel(value: string) {
  if (props.disabled) return;
  emit("update:modelValue", value);
  emit("change", value);
}

function onSelect(item: MenuItem) {
  if (props.disabled) return;
  const barItem = findBarItem(props.items ?? [], item.key);
  const command = barItem?.command || item.key;
  trackEmit({
    component: "MenuBar",
    type: "command",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { command, key: item.key },
  });
  if (barItem) {
    emit("command", command, barItem);
  }
}
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    data-component="MenuBar"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
  >
    <Menu
      direction="horizontal"
      mode="popup"
      :items="menuItems"
      :model-value="modelValue"
      :disabled="disabled"
      :track-id="trackId"
      :telemetry="telemetry"
      @update:model-value="onModel"
      @select="onSelect"
    />
  </div>
</template>
