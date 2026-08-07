<script setup lang="ts">
import Icon from '@amg-webui/core/Icon/index.vue'
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
      'vp-contextmenu__item',
      {
        'vp-contextmenu__item--disabled': item.disabled,
        'vp-contextmenu__item--divider': item.divider
      }
    ]"
    role="menuitem"
    :aria-disabled="item.disabled || undefined"
    @click="emit('click', item, $event)"
    @mouseenter="item.children && emit('mouseenter', item.label)"
    @mouseleave="emit('mouseleave')"
  >
    <template v-if="item.divider" />
    <template v-else>
      <div class="vp-contextmenu__item-content">
        <span v-if="item.icon" class="vp-contextmenu__item-icon">{{ item.icon }}</span>
        <span class="vp-contextmenu__item-label">{{ item.label }}</span>
      </div>
      <span v-if="item.children" class="vp-contextmenu__item-arrow" aria-hidden="true">
        <Icon name="ChevronRight" size="sm" />
      </span>

      <div
        v-if="item.children && activeSubmenu === item.label"
        class="vp-contextmenu__submenu"
        role="menu"
      >
        <ul class="vp-contextmenu__items">
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
