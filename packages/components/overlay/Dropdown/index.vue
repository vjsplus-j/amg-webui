<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { useLocale, useOverlay } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { KEYS } from '@amg-webui/utils/keyboard'
import { getWindow } from '@amg-webui/utils/env'
import { getFixedPanelStyle } from '@amg-webui/utils/domPanel'
import { useNavSelection, type NavItem, isNavItemActive } from '@amg-webui/utils/nav'
import Icon from '@amg-webui/core/Icon/index.vue'
import './style.scss'

const props = withDefaults(
  defineProps<{
    items?: NavItem[]
    modelValue?: string | number
    disabled?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    items: () => [],
    disabled: false,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
  select: [item: NavItem, event: MouseEvent]
  openChange: [open: boolean]
}>()

const { t } = useLocale()
const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

function close() {
  isOpen.value = false
}

function toggle() {
  isOpen.value = !isOpen.value
}

const overlay = useOverlay({
  visible: isOpen,
  kind: 'dropdown',
  container: panelRef,
  modal: false,
  lockScroll: false,
  trapFocus: true,
  restoreFocus: true,
  closeOnEscape: true,
  exclude: () => [triggerRef.value],
  onEscape: () => {
    close()
    void nextTick(() => triggerRef.value?.focus())
  },
  autoFocus: false
})

const { selectItem } = useNavSelection(props, emit, 'Dropdown')

const panelStyle = ref<Record<string, string>>({})
const mergedPanelStyle = computed(() => {
  const z = overlay.zIndex.value
  return z === undefined
    ? panelStyle.value
    : { ...panelStyle.value, zIndex: String(z) }
})
const activeIndex = ref(-1)
const itemRefs = ref<(HTMLButtonElement | null)[]>([])
const openSubIndex = ref<number | null>(null)
const subPanelStyle = ref<Record<string, string>>({})
const subItemRefs = ref<(HTMLButtonElement | null)[]>([])
let subCloseTimer: ReturnType<typeof setTimeout> | null = null

const rootClass = computed(() => [
  'vp-dropdown',
  {
    'vp-dropdown--open': isOpen.value,
    'vp-dropdown--disabled': props.disabled
  },
  props.class
])

const flatItems = computed(() => props.items)

const triggerLabel = computed(() => {
  const hit = findLeaf(props.items, props.modelValue)
  return hit?.label ?? t(LocaleKeys.common.more)
})

function findLeaf(items: NavItem[], value: string | number | undefined): NavItem | undefined {
  for (const item of items) {
    if (item.type === 'divider' || item.type === 'group') continue
    if (isNavItemActive(item, value)) return item
    if (item.children?.length) {
      const nested = findLeaf(item.children, value)
      if (nested) return nested
    }
  }
  return undefined
}

function isSelectable(item: NavItem) {
  return item.type !== 'divider' && item.type !== 'group' && !item.disabled
}

const enabledIndexes = computed(() =>
  flatItems.value
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => isSelectable(item) || (item.children?.length && !item.disabled && item.type !== 'divider'))
    .filter(({ item }) => item.type !== 'divider' && item.type !== 'group')
    .map(({ i }) => i)
)

function syncPanel() {
  if (!triggerRef.value) return
  panelStyle.value = getFixedPanelStyle(triggerRef.value, { align: 'start' })
}

function syncSubPanel(index: number) {
  const el = itemRefs.value[index]
  if (!el) return
  subPanelStyle.value = getFixedPanelStyle(el, { placement: 'right-start' })
}

function teardownPos() {
  const win = getWindow()
  if (!win) return
  win.removeEventListener('scroll', syncPanel, true)
  win.removeEventListener('resize', syncPanel)
}

function clearSubCloseTimer() {
  if (subCloseTimer != null) {
    clearTimeout(subCloseTimer)
    subCloseTimer = null
  }
}

function openSubmenu(index: number) {
  clearSubCloseTimer()
  const item = flatItems.value[index]
  if (!item?.children?.length || item.disabled) {
    openSubIndex.value = null
    return
  }
  openSubIndex.value = index
  void nextTick(() => syncSubPanel(index))
}

function scheduleCloseSubmenu() {
  clearSubCloseTimer()
  subCloseTimer = setTimeout(() => {
    openSubIndex.value = null
    subCloseTimer = null
  }, 120)
}

function onTriggerClick() {
  if (props.disabled) return
  toggle()
}

function focusItem(index: number) {
  activeIndex.value = index
  void nextTick(() => itemRefs.value[index]?.focus())
}

function focusFirst() {
  const first = enabledIndexes.value[0]
  if (first !== undefined) focusItem(first)
}

function moveFocus(delta: number) {
  const list = enabledIndexes.value
  if (!list.length) return
  const cur = list.indexOf(activeIndex.value)
  const next =
    cur < 0
      ? delta > 0
        ? list[0]
        : list[list.length - 1]
      : list[(cur + delta + list.length) % list.length]
  focusItem(next)
}

function onMenuKeydown(e: KeyboardEvent) {
  if (e.key === KEYS.ARROW_DOWN) {
    e.preventDefault()
    moveFocus(1)
  } else if (e.key === KEYS.ARROW_UP) {
    e.preventDefault()
    moveFocus(-1)
  } else if (e.key === KEYS.ARROW_RIGHT) {
    const idx = activeIndex.value
    const item = flatItems.value[idx]
    if (item?.children?.length) {
      e.preventDefault()
      openSubmenu(idx)
      void nextTick(() => subItemRefs.value[0]?.focus())
    }
  } else if (e.key === KEYS.ARROW_LEFT) {
    if (openSubIndex.value != null) {
      e.preventDefault()
      openSubIndex.value = null
      focusItem(activeIndex.value)
    }
  } else if (e.key === KEYS.HOME) {
    e.preventDefault()
    focusItem(enabledIndexes.value[0] ?? 0)
  } else if (e.key === KEYS.END) {
    e.preventDefault()
    focusItem(enabledIndexes.value[enabledIndexes.value.length - 1] ?? 0)
  } else if (e.key === KEYS.ESCAPE) {
    e.preventDefault()
    if (openSubIndex.value != null) {
      openSubIndex.value = null
      focusItem(activeIndex.value)
      return
    }
    close()
    void nextTick(() => triggerRef.value?.focus())
  }
}

function onSelect(item: NavItem, e: MouseEvent) {
  if (item.type === 'divider' || item.type === 'group') return
  if (item.children?.length) {
    const idx = flatItems.value.indexOf(item)
    if (idx >= 0) openSubmenu(idx)
    return
  }
  selectItem(item, e)
  close()
}

function onSubSelect(item: NavItem, e: MouseEvent) {
  if (!isSelectable(item)) return
  selectItem(item, e)
  close()
}

function setItemRef(el: unknown, index: number) {
  itemRefs.value[index] = (el as HTMLButtonElement | null) ?? null
}

function setSubItemRef(el: unknown, index: number) {
  subItemRefs.value[index] = (el as HTMLButtonElement | null) ?? null
}

watch(isOpen, (open) => {
  emit('openChange', open)
  if (open) {
    void nextTick(() => {
      syncPanel()
      const win = getWindow()
      if (win) {
        win.addEventListener('scroll', syncPanel, true)
        win.addEventListener('resize', syncPanel)
      }
      const active = props.items.findIndex(
        (i) => isSelectable(i) && isNavItemActive(i, props.modelValue)
      )
      if (active >= 0) focusItem(active)
      else focusFirst()
    })
  } else {
    teardownPos()
    activeIndex.value = -1
    openSubIndex.value = null
    clearSubCloseTimer()
  }
})

onUnmounted(() => {
  teardownPos()
  clearSubCloseTimer()
})
</script>

<template>
  <div :class="rootClass" :style="style" data-component="Dropdown">
    <button
      ref="triggerRef"
      type="button"
      class="vp-dropdown__trigger"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      @click="onTriggerClick"
    >
      <slot name="trigger">{{ triggerLabel }}</slot>
    </button>
    <Teleport :to="overlay.teleportTo.value ?? 'body'">
      <ul
        v-if="isOpen"
        ref="panelRef"
        class="vp-dropdown__menu vp-dropdown__menu--fixed"
        :style="mergedPanelStyle"
        role="menu"
        tabindex="-1"
        @keydown="onMenuKeydown"
      >
        <template v-for="(item, i) in items" :key="i">
          <li
            v-if="item.type === 'divider'"
            role="separator"
            class="vp-dropdown__divider"
          />
          <li v-else-if="item.type === 'group'" role="presentation" class="vp-dropdown__group">
            <span class="vp-dropdown__group-label">{{ item.label }}</span>
          </li>
          <li
            v-else
            role="none"
            class="vp-dropdown__row"
            @mouseenter="item.children?.length ? openSubmenu(i) : (openSubIndex = null)"
            @mouseleave="item.children?.length ? scheduleCloseSubmenu() : undefined"
          >
            <button
              :ref="(el) => setItemRef(el, i)"
              type="button"
              role="menuitem"
              :class="[
                'vp-dropdown__item',
                {
                  'vp-dropdown__item--active': isNavItemActive(item, modelValue),
                  'vp-dropdown__item--has-children': Boolean(item.children?.length)
                }
              ]"
              :disabled="disabled || item.disabled"
              :tabindex="activeIndex === i ? 0 : -1"
              :aria-haspopup="item.children?.length ? 'menu' : undefined"
              :aria-expanded="item.children?.length ? openSubIndex === i : undefined"
              @click="onSelect(item, $event)"
            >
              <Icon v-if="item.icon" class="vp-dropdown__icon" :name="item.icon" size="sm" />
              <span class="vp-dropdown__label">{{ item.label }}</span>
              <Icon
                v-if="item.children?.length"
                class="vp-dropdown__caret"
                name="ChevronRight"
                size="sm"
              />
            </button>
            <Teleport :to="overlay.teleportTo.value ?? 'body'">
              <ul
                v-if="openSubIndex === i && item.children?.length"
                class="vp-dropdown__menu vp-dropdown__menu--fixed vp-dropdown__submenu"
                :style="subPanelStyle"
                role="menu"
                @mouseenter="clearSubCloseTimer"
                @mouseleave="scheduleCloseSubmenu"
              >
                <template v-for="(child, ci) in item.children" :key="ci">
                  <li
                    v-if="child.type === 'divider'"
                    role="separator"
                    class="vp-dropdown__divider"
                  />
                  <li v-else role="none">
                    <button
                      :ref="(el) => setSubItemRef(el, ci)"
                      type="button"
                      role="menuitem"
                      :class="[
                        'vp-dropdown__item',
                        { 'vp-dropdown__item--active': isNavItemActive(child, modelValue) }
                      ]"
                      :disabled="disabled || child.disabled"
                      @click="onSubSelect(child, $event)"
                    >
                      <Icon v-if="child.icon" class="vp-dropdown__icon" :name="child.icon" size="sm" />
                      <span class="vp-dropdown__label">{{ child.label }}</span>
                    </button>
                  </li>
                </template>
              </ul>
            </Teleport>
          </li>
        </template>
      </ul>
    </Teleport>
  </div>
</template>
