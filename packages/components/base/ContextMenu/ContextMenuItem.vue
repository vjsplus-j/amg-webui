<script setup lang="ts">
import type { ContextMenuItem } from './types'

defineProps<{
  item: ContextMenuItem
  activeSubmenu: string | null
}>()

const emit = defineEmits<{
  (e: 'click', item: ContextMenuItem, event: MouseEvent): void
  (e: 'mouseenter', label: string): void
  (e: 'mouseleave'): void
}>()
</script>

<template>
  <li
    :class="[
      'p-contextmenu-item',
      {
        'p-contextmenu-item-disabled': item.disabled,
        'p-contextmenu-item-divider': item.divider
      }
    ]"
    @click="emit('click', item, $event)"
    @mouseenter="item.children && emit('mouseenter', item.label)"
    @mouseleave="emit('mouseleave')"
  >
    <template v-if="item.divider" />
    <template v-else>
      <div class="p-contextmenu-item-content">
        <span v-if="item.icon" class="p-contextmenu-item-icon">{{ item.icon }}</span>
        <span class="p-contextmenu-item-label">{{ item.label }}</span>
      </div>
      <span v-if="item.children" class="p-contextmenu-item-arrow">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 6l6 6-6 6"/>
        </svg>
      </span>

      <div
        v-if="item.children && activeSubmenu === item.label"
        class="p-contextmenu-submenu p-contextmenu-submenu-visible"
      >
        <ul class="p-contextmenu-items">
          <ContextMenuItem
            v-for="(child, childIndex) in item.children"
            :key="`${child.label}-${childIndex}`"
            :item="child"
            :active-submenu="activeSubmenu"
            @click="(i, e) => emit('click', i, e)"
            @mouseenter="(l) => emit('mouseenter', l)"
            @mouseleave="() => emit('mouseleave')"
          />
        </ul>
      </div>
    </template>
  </li>
</template>