<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'
import Icon from '../Icon/index.vue'
import { useLocale, usePopover } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import { getFixedPanelStyle } from '@amg-webui/utils/domPanel'
import type { TabsNavItem } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    items?: TabsNavItem[]
    modelValue?: string
    closable?: boolean
    disabled?: boolean
    overflow?: boolean
    draggable?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    items: () => [],
    closable: false,
    disabled: false,
    overflow: true,
    draggable: false,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  close: [name: string]
  'update:items': [items: TabsNavItem[]]
  reorder: [payload: { from: number; to: number; items: TabsNavItem[] }]
}>()

const { t } = useLocale()
const scrollRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const moreTriggerRef = ref<HTMLElement | null>(null)
const morePanelRef = ref<HTMLElement | null>(null)
const morePanelStyle = ref<Record<string, string>>({})

const overflowing = ref(false)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const dragFrom = ref<number | null>(null)
const dragOver = ref<number | null>(null)

const {
  isOpen: moreOpen,
  triggerRef: morePopoverTrigger,
  panelRef: morePopoverPanel,
  toggle: toggleMore,
  close: closeMore
} = usePopover()

watch(moreTriggerRef, (el) => {
  morePopoverTrigger.value = el
})
watch(morePanelRef, (el) => {
  morePopoverPanel.value = el
})

const rootClass = computed(() => [
  'vp-tabs-nav',
  {
    'vp-tabs-nav--disabled': props.disabled,
    'vp-tabs-nav--overflow': props.overflow && overflowing.value,
    'vp-tabs-nav--draggable': props.draggable
  },
  props.class
])

function canDragItem(item: TabsNavItem) {
  return props.draggable && !props.disabled && !item.disabled
}

function onDragStart(index: number, item: TabsNavItem, e: DragEvent) {
  if (!canDragItem(item)) {
    e.preventDefault()
    return
  }
  dragFrom.value = index
  e.dataTransfer?.setData('text/plain', item.name)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

function onDragOver(index: number, e: DragEvent) {
  if (dragFrom.value === null) return
  e.preventDefault()
  dragOver.value = index
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}

function onDragLeave(index: number) {
  if (dragOver.value === index) dragOver.value = null
}

function onDrop(to: number, e: DragEvent) {
  e.preventDefault()
  const from = dragFrom.value
  dragFrom.value = null
  dragOver.value = null
  if (from === null || from === to) return
  const next = [...props.items]
  const [moved] = next.splice(from, 1)
  if (!moved) return
  next.splice(to, 0, moved)
  trackEmit({
    component: 'TabsNav',
    type: 'reorder',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { from, to }
  })
  emit('update:items', next)
  emit('reorder', { from, to, items: next })
}

function onDragEnd() {
  dragFrom.value = null
  dragOver.value = null
}

function selectTab(item: TabsNavItem) {
  if (props.disabled || item.disabled) return
  trackEmit({
    component: 'TabsNav',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { name: item.name }
  })
  emit('update:modelValue', item.name)
  emit('change', item.name)
  closeMore()
  void nextTick(() => scrollActiveIntoView())
}

function closeTab(item: TabsNavItem, e: MouseEvent) {
  e.stopPropagation()
  if (props.disabled || item.disabled) return
  const canClose = item.closable !== false && (props.closable || item.closable)
  if (!canClose) return
  trackEmit({
    component: 'TabsNav',
    type: 'close',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { name: item.name }
  })
  emit('close', item.name)
}

function showClose(item: TabsNavItem) {
  if (item.closable === false) return false
  return props.closable || item.closable === true
}

function updateOverflowState() {
  const el = scrollRef.value
  if (!el || !props.overflow) {
    overflowing.value = false
    canScrollLeft.value = false
    canScrollRight.value = false
    return
  }
  const maxScroll = el.scrollWidth - el.clientWidth
  overflowing.value = maxScroll > 1
  canScrollLeft.value = el.scrollLeft > 1
  canScrollRight.value = el.scrollLeft < maxScroll - 1
}

function scrollByDir(dir: -1 | 1) {
  const el = scrollRef.value
  if (!el) return
  const delta = Math.max(120, Math.floor(el.clientWidth * 0.6)) * dir
  el.scrollBy({ left: delta, behavior: 'smooth' })
}

function scrollActiveIntoView() {
  const root = scrollRef.value
  const list = listRef.value
  if (!root || !list || !props.modelValue) return
  const active = list.querySelector(
    `.vp-tabs-nav__item--active`
  ) as HTMLElement | null
  if (!active) return
  const rootRect = root.getBoundingClientRect()
  const tabRect = active.getBoundingClientRect()
  if (tabRect.left < rootRect.left) {
    root.scrollBy({ left: tabRect.left - rootRect.left - 8, behavior: 'smooth' })
  } else if (tabRect.right > rootRect.right) {
    root.scrollBy({ left: tabRect.right - rootRect.right + 8, behavior: 'smooth' })
  }
}

function syncMorePanel() {
  if (!moreTriggerRef.value) return
  morePanelStyle.value = getFixedPanelStyle(moreTriggerRef.value, {
    align: 'end',
    preferredWidth: 160
  })
}

function onMoreToggle() {
  if (props.disabled) return
  toggleMore()
  if (moreOpen.value) {
    void nextTick(() => {
      syncMorePanel()
      window.addEventListener('scroll', syncMorePanel, true)
      window.addEventListener('resize', syncMorePanel)
    })
  } else {
    window.removeEventListener('scroll', syncMorePanel, true)
    window.removeEventListener('resize', syncMorePanel)
  }
}

watch(moreOpen, (open) => {
  if (!open) {
    window.removeEventListener('scroll', syncMorePanel, true)
    window.removeEventListener('resize', syncMorePanel)
  }
})

watch(
  () => [props.items, props.modelValue, props.overflow] as const,
  async () => {
    await nextTick()
    updateOverflowState()
    scrollActiveIntoView()
  },
  { deep: true }
)

let ro: ResizeObserver | null = null

onMounted(() => {
  updateOverflowState()
  scrollActiveIntoView()
  const el = scrollRef.value
  if (el && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => updateOverflowState())
    ro.observe(el)
    if (listRef.value) ro.observe(listRef.value)
  }
  window.addEventListener('resize', updateOverflowState)
})

onUnmounted(() => {
  ro?.disconnect()
  window.removeEventListener('resize', updateOverflowState)
  window.removeEventListener('scroll', syncMorePanel, true)
  window.removeEventListener('resize', syncMorePanel)
})
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    role="tablist"
    data-component="TabsNav"
  >
    <button
      v-if="overflow && overflowing"
      type="button"
      class="vp-tabs-nav__arrow"
      :disabled="disabled || !canScrollLeft"
      :aria-label="t(LocaleKeys.common.previous)"
      @click="scrollByDir(-1)"
    >
      <Icon name="ChevronLeft" size="sm" />
    </button>

    <div
      ref="scrollRef"
      class="vp-tabs-nav__scroll"
      @scroll="updateOverflowState"
    >
      <div ref="listRef" class="vp-tabs-nav__list">
        <div
          v-for="(item, index) in items"
          :key="item.name"
          class="vp-tabs-nav__item"
          :class="{
            'vp-tabs-nav__item--active': modelValue === item.name,
            'vp-tabs-nav__item--disabled': item.disabled,
            'vp-tabs-nav__item--dragging': dragFrom === index,
            'vp-tabs-nav__item--drag-over': dragOver === index && dragFrom !== index
          }"
          role="presentation"
          :draggable="canDragItem(item)"
          @dragstart="onDragStart(index, item, $event)"
          @dragover="onDragOver(index, $event)"
          @dragleave="onDragLeave(index)"
          @drop="onDrop(index, $event)"
          @dragend="onDragEnd"
        >
          <button
            type="button"
            class="vp-tabs-nav__label"
            role="tab"
            :aria-selected="modelValue === item.name"
            :disabled="disabled || item.disabled"
            :title="item.label"
            @click="selectTab(item)"
          >
            {{ item.label }}
          </button>
          <button
            v-if="showClose(item)"
            type="button"
            class="vp-tabs-nav__close"
            :title="t(LocaleKeys.common.close)"
            :aria-label="t(LocaleKeys.common.closeTab)"
            :disabled="disabled || item.disabled"
            @click="closeTab(item, $event)"
          >
            <Icon name="X" size="sm" />
          </button>
        </div>
      </div>
    </div>

    <button
      v-if="overflow && overflowing"
      type="button"
      class="vp-tabs-nav__arrow"
      :disabled="disabled || !canScrollRight"
      :aria-label="t(LocaleKeys.common.next)"
      @click="scrollByDir(1)"
    >
      <Icon name="ChevronRight" size="sm" />
    </button>

    <div v-if="overflow && overflowing" class="vp-tabs-nav__more">
      <button
        ref="moreTriggerRef"
        type="button"
        class="vp-tabs-nav__more-btn"
        :disabled="disabled"
        :aria-expanded="moreOpen"
        aria-haspopup="menu"
        :aria-label="t(LocaleKeys.common.more)"
        :title="t(LocaleKeys.common.more)"
        @click="onMoreToggle"
      >
        <Icon name="Ellipsis" size="sm" />
      </button>
      <Teleport to="body">
        <ul
          v-if="moreOpen"
          ref="morePanelRef"
          class="vp-tabs-nav__more-menu"
          :style="morePanelStyle"
          role="menu"
        >
          <li v-for="item in items" :key="item.name" role="none">
            <button
              type="button"
              role="menuitem"
              class="vp-tabs-nav__more-item"
              :class="{ 'vp-tabs-nav__more-item--active': modelValue === item.name }"
              :disabled="disabled || item.disabled"
              @click="selectTab(item)"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>
      </Teleport>
    </div>
  </div>
</template>
