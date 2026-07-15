<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { MenuBarProps, MenuBarEmits, MenuBarItem } from './types'
import MenuBarSubItem from './MenuBarSubItem.vue'
import './style.scss'

const props = withDefaults(defineProps<MenuBarProps>(), {
  items: () => []
})

const emit = defineEmits<MenuBarEmits>()

const activeMenu = ref<string | null>(null)
const activeSubmenu = ref<string | null>(null)

const handleMenuClick = (item: MenuBarItem) => {
  if (item.disabled || item.divider) return
  
  if (item.children) {
    activeMenu.value = activeMenu.value === item.label ? null : item.label
    return
  }
  
  if (item.command) {
    emit('command', item.command, item)
  }
  emit('update:modelValue', item.command || item.label)
}

const handleSubmenuItemClick = (item: MenuBarItem) => {
  if (item.disabled || item.divider) return
  
  if (item.children) {
    activeSubmenu.value = activeSubmenu.value === item.label ? null : item.label
    return
  }
  
  if (item.command) {
    emit('command', item.command, item)
  }
  emit('update:modelValue', item.command || item.label)
  closeAllMenus()
}

const closeAllMenus = () => {
  activeMenu.value = null
  activeSubmenu.value = null
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.p-menubar')) {
    closeAllMenus()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div :class="['p-menubar', props.class]" :style="style">
    <ul class="p-menubar-items">
      <template v-for="(item, index) in items" :key="`${item.label}-${index}`">
        <li v-if="item.divider" class="p-menubar-item-divider" />
        <li v-else :class="['p-menubar-item']">
          <button
            :class="[
              'p-menubar-item-button',
              {
                'p-menubar-item-button-disabled': item.disabled,
                'p-menubar-item-button-selected': modelValue === (item.command || item.label)
              }
            ]"
            @click="handleMenuClick(item)"
            @mouseenter="item.children && (activeMenu = item.label)"
            @mouseleave="activeMenu = null"
          >
            <span v-if="item.icon" class="p-menubar-item-icon">{{ item.icon }}</span>
            {{ item.label }}
            <span v-if="item.children" class="p-menubar-item-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </span>
          </button>

          <div
            v-if="item.children && activeMenu === item.label"
            class="p-menubar-submenu p-menubar-submenu-visible"
          >
            <ul class="p-menubar-submenu-items">
              <MenuBarSubItem
                v-for="(child, childIndex) in item.children"
                :key="`${child.label}-${childIndex}`"
                :item="child"
                :model-value="modelValue"
                :active-submenu="activeSubmenu"
                @click="handleSubmenuItemClick"
                @mouseenter="(label) => { activeSubmenu = label }"
                @mouseleave="() => { activeSubmenu = null }"
              />
            </ul>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>