<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { clampToViewport } from '@amg-webui/utils/domPanel'
import { trackEmit } from '@amg-webui/telemetry'
import type { ContextMenuEmits, ContextMenuItem, ContextMenuProps } from './types'
import ContextMenuItemComp from './ContextMenuItem.vue'
import './style.scss'

const props = withDefaults(defineProps<ContextMenuProps>(), {
  items: () => [],
  modelValue: false,
  target: null,
  telemetry: undefined
})

const emit = defineEmits<ContextMenuEmits>()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const position = ref({ x: 0, y: 0 })
const activeSubmenu = ref<string | null>(null)

const menuStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  ...props.style
}))

async function showMenu(x: number, y: number) {
  position.value = { x, y }
  isOpen.value = true
  activeSubmenu.value = null
  emit('update:modelValue', true)
  emit('show')
  await nextTick()
  const el = menuRef.value
  if (!el) return
  const { width, height } = el.getBoundingClientRect()
  position.value = clampToViewport(x, y, width, height)
}

function hideMenu() {
  if (!isOpen.value) return
  isOpen.value = false
  activeSubmenu.value = null
  emit('update:modelValue', false)
  emit('hide')
}

function handleTargetContextMenu(event: MouseEvent) {
  if (!props.target) return
  const el = event.target as Node | null
  if (!el || !props.target.contains(el)) return
  event.preventDefault()
  void showMenu(event.clientX, event.clientY)
}

function handleHostContextMenu(event: MouseEvent) {
  event.preventDefault()
  void showMenu(event.clientX, event.clientY)
}

function handleItemClick(item: ContextMenuItem, event: MouseEvent) {
  if (item.disabled || item.divider) return
  if (item.children?.length) {
    activeSubmenu.value = activeSubmenu.value === item.label ? null : item.label
    event.stopPropagation()
    return
  }
  if (item.command) {
    trackEmit({
      component: 'ContextMenu',
      type: 'command',
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { command: item.command }
    })
    emit('command', item.command, item)
  }
  hideMenu()
}

function handleClickOutside(event: MouseEvent) {
  if (!isOpen.value) return
  const el = event.target as HTMLElement | null
  if (el?.closest('.vp-contextmenu__panel')) return
  hideMenu()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    hideMenu()
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val === isOpen.value) return
    if (val) {
      isOpen.value = true
      emit('show')
    } else {
      hideMenu()
    }
  }
)

watch(
  () => props.target,
  (next, prev) => {
    if (prev) prev.removeEventListener('contextmenu', handleTargetContextMenu)
    if (next) next.addEventListener('contextmenu', handleTargetContextMenu)
  }
)

onMounted(() => {
  if (props.target) {
    props.target.addEventListener('contextmenu', handleTargetContextMenu)
  }
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (props.target) {
    props.target.removeEventListener('contextmenu', handleTargetContextMenu)
  }
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    v-if="!target"
    class="vp-contextmenu__host"
    data-component="ContextMenu"
    @contextmenu="handleHostContextMenu"
  >
    <slot />
  </div>

  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="menuRef"
      :class="['vp-contextmenu__panel', props.class]"
      :style="menuStyle"
      role="menu"
      data-component="ContextMenu"
    >
      <ul class="vp-contextmenu__items">
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
  </Teleport>
</template>
