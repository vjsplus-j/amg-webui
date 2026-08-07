<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useOverlay } from '@amg-webui/hooks'
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
const hostRef = ref<HTMLElement | null>(null)
const position = ref({ x: 0, y: 0 })
const activeSubmenu = ref<string | null>(null)

const overlay = useOverlay({
  visible: isOpen,
  kind: 'dropdown',
  container: menuRef,
  modal: false,
  lockScroll: false,
  trapFocus: false,
  closeOnEscape: true,
  exclude: () => [props.target, hostRef.value],
  onEscape: () => hideMenu(),
  onClickOutside: () => hideMenu(),
  autoFocus: false
})

const menuStyle = computed(() => {
  const z = overlay.zIndex.value
  const base = {
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    ...props.style
  }
  return z === undefined ? base : { ...base, zIndex: String(z) }
})

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
})

onUnmounted(() => {
  if (props.target) {
    props.target.removeEventListener('contextmenu', handleTargetContextMenu)
  }
})

defineExpose({
  openAt: showMenu,
  hide: hideMenu,
  isOpen
})
</script>

<template>
  <div
    v-if="!target && $slots.default"
    ref="hostRef"
    class="vp-contextmenu__host"
    data-component="ContextMenu"
    @contextmenu="handleHostContextMenu"
  >
    <slot />
  </div>

  <Teleport :to="overlay.teleportTo.value ?? 'body'">
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
