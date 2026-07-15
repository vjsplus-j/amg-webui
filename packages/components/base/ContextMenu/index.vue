<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { ContextMenuProps, ContextMenuEmits } from './types'
import type { ContextMenuItem } from './types'
import ContextMenuItemComp from './ContextMenuItem.vue'
import './style.scss'

const props = withDefaults(defineProps<ContextMenuProps>(), {
  items: () => [],
  modelValue: false
})

const emit = defineEmits<ContextMenuEmits>()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const position = ref({ x: 0, y: 0 })
const activeSubmenu = ref<string | null>(null)

const handleContextMenu = (event: MouseEvent) => {
  if (!props.target) return
  const target = event.target as HTMLElement
  if (!props.target.contains(target)) return

  event.preventDefault()
  showMenu(event.clientX, event.clientY)
}

const showMenu = (x: number, y: number) => {
  position.value = { x, y }
  isOpen.value = true
  emit('update:modelValue', true)
  emit('show')
}

const hideMenu = () => {
  isOpen.value = false
  activeSubmenu.value = null
  emit('update:modelValue', false)
  emit('hide')
}

const handleItemClick = (item: ContextMenuItem, event: MouseEvent) => {
  if (item.disabled || item.divider) return
  if (item.children) {
    activeSubmenu.value = activeSubmenu.value === item.label ? null : item.label
    event.stopPropagation()
    return
  }
  if (item.command) {
    emit('command', item.command, item)
  }
  hideMenu()
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.p-contextmenu')) {
    hideMenu()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    hideMenu()
  }
}

watch(() => props.modelValue, (val) => {
  isOpen.value = val
})

onMounted(() => {
  if (props.target) {
    props.target.addEventListener('contextmenu', handleContextMenu)
  }
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

watch(
  () => props.target,
  (next, prev) => {
    if (prev) prev.removeEventListener('contextmenu', handleContextMenu)
    if (next) next.addEventListener('contextmenu', handleContextMenu)
  }
)

onUnmounted(() => {
  if (props.target) {
    props.target.removeEventListener('contextmenu', handleContextMenu)
  }
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

const menuStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  ...props.style
}))
</script>

<template>
  <div
    v-if="isOpen"
    ref="menuRef"
    :class="['p-contextmenu', { 'p-contextmenu-visible': isOpen }, props.class]"
    :style="menuStyle"
  >
    <ul class="p-contextmenu-items">
      <ContextMenuItemComp
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        :item="item"
        :active-submenu="activeSubmenu"
        @click="handleItemClick"
        @mouseenter="(label: string) => { activeSubmenu = label }"
        @mouseleave="() => { activeSubmenu = null }"
      />
    </ul>
  </div>
</template>