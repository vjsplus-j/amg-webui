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
import MenuBadgeMark from './MenuBadgeMark.vue'
import { trackEmit } from '@amg-webui/telemetry'
import { getFixedPanelStyle, type PanelPlacement } from '@amg-webui/utils/domPanel'
import type { MenuItem, MenuBadge } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    items?: MenuItem[]
    modelValue?: string
    openKeys?: string[]
    collapsed?: boolean
    direction?: 'vertical' | 'horizontal'
    /**
     * inline = expand in place (sider).
     * popup = Teleport flyout (menubar / horizontal).
     * auto = horizontal|collapsed → popup, else inline.
     */
    mode?: 'auto' | 'inline' | 'popup'
    disabled?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    items: () => [],
    openKeys: () => [],
    collapsed: false,
    direction: 'vertical',
    mode: 'auto',
    disabled: false,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:openKeys': [value: string[]]
  change: [value: string]
  select: [item: MenuItem, event: MouseEvent]
  openChange: [openKeys: string[]]
}>()

const innerOpen = ref<string[]>([...props.openKeys])
const popupKey = ref<string | null>(null)
const triggerEls = ref<Record<string, HTMLElement | null>>({})
const panelStyle = ref<Record<string, string>>({})
const panelRef = ref<HTMLElement | null>(null)

watch(
  () => props.openKeys,
  (keys) => {
    innerOpen.value = [...(keys ?? [])]
  }
)

const usePopup = computed(() => {
  if (props.mode === 'popup') return true
  if (props.mode === 'inline') return false
  return props.direction === 'horizontal' || props.collapsed
})

const rootClass = computed(() => [
  'vp-menu',
  `vp-menu--${props.direction}`,
  {
    'vp-menu--collapsed': props.collapsed,
    'vp-menu--disabled': props.disabled,
    'vp-menu--popup': usePopup.value
  },
  props.class
])

function isOpen(key: string) {
  return usePopup.value ? popupKey.value === key : innerOpen.value.includes(key)
}

function setTriggerRef(key: string, el: unknown) {
  triggerEls.value[key] = (el as HTMLElement | null) ?? null
}

function syncPopupPos(key: string) {
  const trigger = triggerEls.value[key]
  if (!trigger) return
  const placement: PanelPlacement =
    props.direction === 'horizontal' ? 'bottom-start' : 'right-start'
  panelStyle.value = getFixedPanelStyle(trigger, {
    placement,
    preferredWidth: 160,
    flip: true
  })
}

function openPopup(key: string) {
  popupKey.value = key
  void nextTick(() => {
    syncPopupPos(key)
    window.addEventListener('scroll', onWinScroll, true)
    window.addEventListener('resize', onWinScroll)
  })
  emit('update:openKeys', [key])
  emit('openChange', [key])
}

function closePopup() {
  popupKey.value = null
  window.removeEventListener('scroll', onWinScroll, true)
  window.removeEventListener('resize', onWinScroll)
  emit('update:openKeys', [])
  emit('openChange', [])
}

function onWinScroll() {
  if (popupKey.value) syncPopupPos(popupKey.value)
}

function toggleOpen(key: string) {
  if (props.disabled) return
  if (usePopup.value) {
    if (popupKey.value === key) closePopup()
    else openPopup(key)
    return
  }
  if (props.collapsed) return
  const next = isOpen(key)
    ? innerOpen.value.filter((k) => k !== key)
    : [...innerOpen.value, key]
  innerOpen.value = next
  emit('update:openKeys', next)
  emit('openChange', next)
}

function itemBadges(item: MenuItem): MenuBadge[] {
  if (item.badges?.length) return item.badges
  if (item.badge) return [{ label: item.badge, tone: 'gold' }]
  return []
}

function leafTitle(item: MenuItem): string {
  const labels = itemBadges(item).map((b) => b.label)
  return labels.length ? `${item.label} · ${labels.join(' · ')}` : item.label
}

function selectItem(item: MenuItem, e: MouseEvent) {
  if (item.disabled || props.disabled || item.type === 'group') return
  if (item.children?.length) {
    toggleOpen(item.key)
    return
  }
  trackEmit({
    component: 'Menu',
    type: 'select',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { key: item.key }
  })
  emit('update:modelValue', item.key)
  emit('change', item.key)
  emit('select', item, e)
  if (usePopup.value) closePopup()
}

function itemClass(item: MenuItem, depth: number) {
  const badges = itemBadges(item)
  return [
    'vp-menu__item',
    `vp-menu__item--depth-${Math.min(depth, 2)}`,
    {
      'vp-menu__item--active': props.modelValue === item.key,
      'vp-menu__item--folder': Boolean(item.children?.length),
      'vp-menu__item--disabled': item.disabled,
      'vp-menu__item--open': item.children?.length ? isOpen(item.key) : false,
      'vp-menu__item--has-hot': badges.some((b) => b.tone === 'hot')
    }
  ]
}

function popupChildren(key: string): MenuItem[] {
  for (const item of props.items) {
    if (item.key === key) return item.children ?? []
    if (item.type === 'group') {
      for (const child of item.children ?? []) {
        if (child.key === key) return child.children ?? []
      }
    }
  }
  return []
}

function onDocPointer(e: MouseEvent) {
  if (!popupKey.value) return
  const t = e.target as Node
  const trigger = triggerEls.value[popupKey.value]
  if (trigger?.contains(t) || panelRef.value?.contains(t)) return
  closePopup()
}

function onDocKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && popupKey.value) closePopup()
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointer, true)
  document.addEventListener('keydown', onDocKey)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocPointer, true)
  document.removeEventListener('keydown', onDocKey)
  window.removeEventListener('scroll', onWinScroll, true)
  window.removeEventListener('resize', onWinScroll)
})

watch(usePopup, (popup) => {
  if (!popup) closePopup()
})
</script>

<template>
  <nav
    :class="rootClass"
    :style="style"
    role="navigation"
    data-component="Menu"
  >
    <template v-for="item in items" :key="item.key">
      <!-- group -->
      <div v-if="item.type === 'group'" class="vp-menu__group">
        <h2 v-if="!collapsed" class="vp-menu__group-title">{{ item.label }}</h2>
        <template v-for="child in item.children ?? []" :key="child.key">
          <div v-if="child.children?.length" class="vp-menu__subtree">
            <button
              :ref="(el) => setTriggerRef(child.key, el)"
              type="button"
              :class="itemClass(child, 0)"
              :disabled="disabled || child.disabled"
              :aria-expanded="isOpen(child.key)"
              :title="collapsed ? leafTitle(child) : undefined"
              @click="selectItem(child, $event)"
            >
              <span v-if="child.icon" class="vp-menu__icon">
                <Icon :name="child.icon" size="sm" aria-hidden="true" />
              </span>
              <span v-if="!collapsed" class="vp-menu__label">{{ child.label }}</span>
              <span
                v-if="!collapsed && itemBadges(child).length"
                class="vp-menu__badges"
              >
                <MenuBadgeMark
                  v-for="(b, bi) in itemBadges(child)"
                  :key="`${child.key}-b-${bi}`"
                  :badge="b"
                />
              </span>
              <span v-if="!collapsed || usePopup" class="vp-menu__chevron">
                <Icon
                  :name="
                    usePopup
                      ? direction === 'horizontal'
                        ? 'ChevronDown'
                        : 'ChevronRight'
                      : isOpen(child.key)
                        ? 'ChevronDown'
                        : 'ChevronRight'
                  "
                  size="sm"
                  aria-hidden="true"
                />
              </span>
            </button>
            <div
              v-if="!usePopup && !collapsed && isOpen(child.key)"
              class="vp-menu__children"
              role="group"
            >
              <button
                v-for="leaf in child.children"
                :key="leaf.key"
                type="button"
                :class="itemClass(leaf, 1)"
                :disabled="disabled || leaf.disabled"
                :title="leafTitle(leaf)"
                @click="selectItem(leaf, $event)"
              >
                <span class="vp-menu__label">{{ leaf.label }}</span>
                <span v-if="itemBadges(leaf).length" class="vp-menu__badges">
                  <MenuBadgeMark
                    v-for="(b, bi) in itemBadges(leaf)"
                    :key="`${leaf.key}-b-${bi}`"
                    :badge="b"
                  />
                </span>
              </button>
            </div>
          </div>
          <button
            v-else
            type="button"
            :class="itemClass(child, 0)"
            :disabled="disabled || child.disabled"
            :title="collapsed ? leafTitle(child) : undefined"
            @click="selectItem(child, $event)"
          >
            <span v-if="child.icon" class="vp-menu__icon">
              <Icon :name="child.icon" size="sm" aria-hidden="true" />
            </span>
            <span v-if="!collapsed" class="vp-menu__label">{{ child.label }}</span>
            <span
              v-if="!collapsed && itemBadges(child).length"
              class="vp-menu__badges"
            >
              <MenuBadgeMark
                v-for="(b, bi) in itemBadges(child)"
                :key="`${child.key}-b-${bi}`"
                :badge="b"
              />
            </span>
          </button>
        </template>
      </div>

      <!-- folder -->
      <div v-else-if="item.children?.length" class="vp-menu__subtree">
        <button
          :ref="(el) => setTriggerRef(item.key, el)"
          type="button"
          :class="itemClass(item, 0)"
          :disabled="disabled || item.disabled"
          :aria-expanded="isOpen(item.key)"
          :title="collapsed ? leafTitle(item) : undefined"
          @click="selectItem(item, $event)"
        >
          <span v-if="item.icon" class="vp-menu__icon">
            <Icon :name="item.icon" size="sm" aria-hidden="true" />
          </span>
          <span v-if="!collapsed" class="vp-menu__label">{{ item.label }}</span>
          <span
            v-if="!collapsed && itemBadges(item).length"
            class="vp-menu__badges"
          >
            <MenuBadgeMark
              v-for="(b, bi) in itemBadges(item)"
              :key="`${item.key}-b-${bi}`"
              :badge="b"
            />
          </span>
          <span v-if="!collapsed || usePopup" class="vp-menu__chevron">
            <Icon
              :name="
                usePopup
                  ? direction === 'horizontal'
                    ? 'ChevronDown'
                    : 'ChevronRight'
                  : isOpen(item.key)
                    ? 'ChevronDown'
                    : 'ChevronRight'
              "
              size="sm"
              aria-hidden="true"
            />
          </span>
        </button>
        <div
          v-if="!usePopup && !collapsed && isOpen(item.key)"
          class="vp-menu__children"
          role="group"
        >
          <button
            v-for="leaf in item.children"
            :key="leaf.key"
            type="button"
            :class="itemClass(leaf, 1)"
            :disabled="disabled || leaf.disabled"
            :title="leafTitle(leaf)"
            @click="selectItem(leaf, $event)"
          >
            <span class="vp-menu__label">{{ leaf.label }}</span>
            <span v-if="itemBadges(leaf).length" class="vp-menu__badges">
              <MenuBadgeMark
                v-for="(b, bi) in itemBadges(leaf)"
                :key="`${leaf.key}-b-${bi}`"
                :badge="b"
              />
            </span>
          </button>
        </div>
      </div>

      <!-- leaf -->
      <button
        v-else
        type="button"
        :class="itemClass(item, 0)"
        :disabled="disabled || item.disabled"
        :title="collapsed ? leafTitle(item) : undefined"
        @click="selectItem(item, $event)"
      >
        <span v-if="item.icon" class="vp-menu__icon">
          <Icon :name="item.icon" size="sm" aria-hidden="true" />
        </span>
        <span v-if="!collapsed" class="vp-menu__label">{{ item.label }}</span>
        <span
          v-if="!collapsed && itemBadges(item).length"
          class="vp-menu__badges"
        >
          <MenuBadgeMark
            v-for="(b, bi) in itemBadges(item)"
            :key="`${item.key}-b-${bi}`"
            :badge="b"
          />
        </span>
      </button>
    </template>

    <Teleport to="body">
      <ul
        v-if="usePopup && popupKey"
        ref="panelRef"
        class="vp-menu__popup"
        :style="panelStyle"
        role="menu"
      >
        <li v-for="leaf in popupChildren(popupKey)" :key="leaf.key" role="none">
          <button
            type="button"
            role="menuitem"
            :class="itemClass(leaf, 1)"
            :disabled="disabled || leaf.disabled"
            :title="leafTitle(leaf)"
            @click="selectItem(leaf, $event)"
          >
            <span v-if="leaf.icon" class="vp-menu__icon">
              <Icon :name="leaf.icon" size="sm" aria-hidden="true" />
            </span>
            <span class="vp-menu__label">{{ leaf.label }}</span>
            <span v-if="itemBadges(leaf).length" class="vp-menu__badges">
              <MenuBadgeMark
                v-for="(b, bi) in itemBadges(leaf)"
                :key="`${leaf.key}-b-${bi}`"
                :badge="b"
              />
            </span>
          </button>
        </li>
      </ul>
    </Teleport>
  </nav>
</template>
