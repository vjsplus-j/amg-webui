<script setup lang="ts">
import type { MenuBarItem } from './types'

defineProps<{
  item: MenuBarItem
  modelValue?: string
  activeSubmenu: string | null
}>()

const emit = defineEmits<{
  (e: 'click', item: MenuBarItem): void
  (e: 'mouseenter', label: string): void
  (e: 'mouseleave'): void
}>()
</script>

<template>
  <li
    :class="[
      'p-menubar-submenu-item',
      {
        'p-menubar-submenu-item-disabled': item.disabled,
        'p-menubar-submenu-item-divider': item.divider,
        'p-menubar-submenu-item-selected': !item.divider && !item.children && modelValue === (item.command || item.label)
      }
    ]"
    @click="emit('click', item)"
    @mouseenter="item.children && emit('mouseenter', item.label)"
    @mouseleave="emit('mouseleave')"
  >
    <template v-if="item.divider" />
    <template v-else>
      <div class="p-menubar-submenu-item-content">
        <span v-if="item.icon" class="p-menubar-submenu-item-icon">{{ item.icon }}</span>
        <span class="p-menubar-submenu-item-label">{{ item.label }}</span>
      </div>
      <span v-if="item.children" class="p-menubar-submenu-item-arrow">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 6l6 6-6 6"/>
        </svg>
      </span>

      <div
        v-if="item.children && activeSubmenu === item.label"
        class="p-menubar-nested-submenu p-menubar-nested-submenu-visible"
      >
        <ul class="p-menubar-submenu-items">
          <MenuBarSubItem
            v-for="(child, childIndex) in item.children"
            :key="`${child.label}-${childIndex}`"
            :item="child"
            :model-value="modelValue"
            :active-submenu="activeSubmenu"
            @click="emit('click', $event)"
            @mouseenter="emit('mouseenter', $event)"
            @mouseleave="emit('mouseleave')"
          />
        </ul>
      </div>
    </template>
  </li>
</template>