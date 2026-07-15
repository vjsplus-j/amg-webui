<script setup lang="ts">
import { nextTick, onUnmounted, ref } from 'vue'
import type { Size } from '@amg-webui/types'
import Icon from '../Icon/index.vue'

const props = defineProps<{
  size: Size
  iconSize: Size
}>()

const menuRef = ref<HTMLDetailsElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const open = ref(false)
const panelStyle = ref<Record<string, string>>({})

function syncPanelPosition() {
  const summary = menuRef.value?.querySelector('summary')
  if (!summary) return
  const rect = summary.getBoundingClientRect()
  panelStyle.value = {
    top: `${Math.round(rect.bottom)}px`,
    left: `${Math.round(rect.right)}px`,
    minWidth: `${Math.round(Math.max(rect.width * 2, rect.width))}px`
  }
}

function closeMenu() {
  if (menuRef.value) menuRef.value.open = false
  open.value = false
}

function onToggle(event: Event) {
  const el = event.target as HTMLDetailsElement
  open.value = el.open
  if (el.open) {
    void nextTick(() => {
      syncPanelPosition()
      window.addEventListener('scroll', syncPanelPosition, true)
      window.addEventListener('resize', syncPanelPosition)
      document.addEventListener('pointerdown', onDocPointer, true)
    })
  } else {
    teardownListeners()
  }
}

function onDocPointer(event: PointerEvent) {
  const target = event.target as Node
  if (menuRef.value?.contains(target)) return
  if (panelRef.value?.contains(target)) return
  closeMenu()
}

function teardownListeners() {
  window.removeEventListener('scroll', syncPanelPosition, true)
  window.removeEventListener('resize', syncPanelPosition)
  document.removeEventListener('pointerdown', onDocPointer, true)
}

function onPanelClick() {
  window.setTimeout(() => closeMenu(), 0)
}

onUnmounted(() => {
  teardownListeners()
})
</script>

<template>
  <details ref="menuRef" class="vp-button-split__menu" @toggle="onToggle">
    <summary
      class="vp-button vp-button--solid vp-button--secondary vp-button-split__trigger"
      :class="[`vp-button--${props.size}`]"
    >
      <Icon name="ChevronDown" :size="props.iconSize" />
    </summary>
    <Teleport to="body">
      <div
        v-if="open"
        ref="panelRef"
        class="vp-button-split__panel vp-button-split__panel--open"
        :style="panelStyle"
        role="menu"
        @click="onPanelClick"
      >
        <slot />
      </div>
    </Teleport>
  </details>
</template>
