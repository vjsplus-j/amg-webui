<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'
import { trackEmit } from '@amg-webui/telemetry'
import { navItemValue, type NavItem } from '@amg-webui/utils/nav'
import './style.scss'

const props = withDefaults(
  defineProps<{
    items?: NavItem[]
    modelValue?: string | number
    disabled?: boolean
    direction?: 'horizontal' | 'vertical'
    /** Scroll offset from top when jumping / detecting */
    offset?: number
    /** CSS selector for scroll container; default = window */
    container?: string
    /** Smooth scroll on click */
    smooth?: boolean
    bound?: number
    /** Stick nav while its scroll parent scrolls */
    affix?: boolean
    /** Sticky top offset (number → px) when affix */
    affixOffset?: number
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    items: () => [],
    direction: 'vertical',
    disabled: false,
    offset: 0,
    smooth: true,
    bound: 0,
    affix: false,
    affixOffset: 0,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
  select: [item: NavItem, event: MouseEvent]
}>()

const scrolling = ref(false)
let scrollTimer: ReturnType<typeof setTimeout> | null = null

const rootClass = computed(() => [
  'vp-anchor',
  `vp-anchor--${props.direction}`,
  {
    'vp-anchor--disabled': props.disabled,
    'vp-anchor--affix': props.affix
  },
  props.class
])

const rootStyle = computed(() => {
  const base: Record<string, string> = { ...(props.style ?? {}) }
  if (props.affix) {
    base['--vp-anchor-affix-top'] = `${props.affixOffset || 0}px`
  }
  return base
})

function resolveHref(item: NavItem): string | undefined {
  if (item.href) return item.href
  if (typeof item.to === 'string' && item.to.startsWith('#')) return item.to
  if (typeof item.value === 'string' && item.value.startsWith('#')) return item.value
  if (item.value != null) return `#${item.value}`
  return undefined
}

function targetId(item: NavItem): string | null {
  const href = resolveHref(item)
  if (!href?.startsWith('#')) return null
  return decodeURIComponent(href.slice(1))
}

function getScrollRoot(): HTMLElement | Window {
  if (props.container) {
    const el = document.querySelector(props.container)
    if (el instanceof HTMLElement) return el
  }
  return window
}

function getScrollTop(root: HTMLElement | Window): number {
  if (root === window) return window.scrollY || document.documentElement.scrollTop
  return (root as HTMLElement).scrollTop
}

function isActive(item: NavItem) {
  return navItemValue(item) === props.modelValue || resolveHref(item) === `#${props.modelValue}`
}

function setActive(item: NavItem) {
  const v = navItemValue(item)
  emit('update:modelValue', v)
  emit('change', v)
}

function selectItem(item: NavItem, e: MouseEvent) {
  if (item.disabled || props.disabled) return
  trackEmit({
    component: 'Anchor',
    type: 'select',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value: navItemValue(item) }
  })
  setActive(item)
  emit('select', item, e)

  const id = targetId(item)
  if (!id) return
  const el = document.getElementById(id)
  if (!el) return

  scrolling.value = true
  const root = getScrollRoot()
  const behavior = props.smooth ? 'smooth' : 'auto'
  if (root === window) {
    const top = el.getBoundingClientRect().top + window.scrollY - (props.offset || 0)
    window.scrollTo({ top, behavior })
  } else {
    const container = root as HTMLElement
    const top =
      el.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      (props.offset || 0)
    container.scrollTo({ top, behavior })
  }
  if (scrollTimer) clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    scrolling.value = false
  }, 400)
}

function syncFromScroll() {
  if (scrolling.value || props.disabled) return
  const root = getScrollRoot()
  const scrollTop = getScrollTop(root) + (props.offset || 0) + (props.bound || 0)
  let current: NavItem | null = null

  for (const item of props.items) {
    const id = targetId(item)
    if (!id) continue
    const el = document.getElementById(id)
    if (!el) continue
    let top: number
    if (root === window) {
      top = el.getBoundingClientRect().top + window.scrollY
    } else {
      const container = root as HTMLElement
      top =
        el.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop
    }
    if (top <= scrollTop + 1) current = item
  }
  if (current && navItemValue(current) !== props.modelValue) {
    setActive(current)
  }
}

let boundRoot: HTMLElement | Window | null = null

function bindScroll() {
  unbindScroll()
  boundRoot = getScrollRoot()
  boundRoot.addEventListener('scroll', syncFromScroll, { passive: true })
  syncFromScroll()
}

function unbindScroll() {
  if (!boundRoot) return
  boundRoot.removeEventListener('scroll', syncFromScroll)
  boundRoot = null
}

watch(
  () => [props.container, props.items, props.offset, props.bound] as const,
  () => bindScroll(),
  { deep: true }
)

onMounted(() => bindScroll())
onUnmounted(() => {
  unbindScroll()
  if (scrollTimer) clearTimeout(scrollTimer)
})
</script>

<template>
  <nav
    :class="rootClass"
    :style="rootStyle"
    role="navigation"
    data-component="Anchor"
  >
    <button
      v-for="(item, i) in items"
      :key="i"
      type="button"
      :class="['vp-anchor__item', { 'vp-anchor__item--active': isActive(item) }]"
      :disabled="disabled || item.disabled"
      @click="selectItem(item, $event)"
    >
      {{ item.label }}
    </button>
  </nav>
</template>
