<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useNavSelection } from '@amg-webui/utils/nav'
import type { NavItem } from '@amg-webui/utils/nav'
import { getDocument } from '@amg-webui/utils/env'
import type { IndexNavEmits, IndexNavProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<IndexNavProps>(), {
  items: () => [],
  direction: 'horizontal',
  scrollToTarget: true,
  scrollBehavior: 'smooth',
  sticky: false,
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<IndexNavEmits>()
const { t } = useLocale()
const navRef = ref<HTMLElement | null>(null)
const { selectItem, isActive } = useNavSelection(props, emit, 'IndexNav')

const rootClass = computed(() => [
  'vp-index-nav',
  `vp-index-nav--${props.direction}`,
  {
    'vp-index-nav--sticky': props.sticky,
    'vp-index-nav--disabled': props.disabled
  },
  props.class
])

function resolveTarget(item: { href?: string }): HTMLElement | undefined {
  if (!item.href?.startsWith('#')) return undefined
  return getDocument()?.getElementById(item.href.slice(1)) ?? undefined
}

function onSelect(item: NavItem, event: MouseEvent) {
  if (!item || props.disabled || item.disabled) return
  selectItem(item, event)
  const target = resolveTarget(item)
  if (props.scrollToTarget && target) {
    target.scrollIntoView({ behavior: props.scrollBehavior, block: 'start' })
  }
  emit('navigate', item, target)
}

function onKeydown(event: KeyboardEvent) {
  const buttons = navRef.value?.querySelectorAll<HTMLButtonElement>(
    '.vp-index-nav__item:not(:disabled)'
  )
  if (!buttons?.length) return
  const current = Array.from(buttons).indexOf(event.currentTarget as HTMLButtonElement)
  if (current < 0) return
  const forward = props.direction === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  const backward = props.direction === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  let next = current
  if (event.key === forward) next = (current + 1) % buttons.length
  else if (event.key === backward) next = (current - 1 + buttons.length) % buttons.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = buttons.length - 1
  else return
  event.preventDefault()
  buttons[next]?.focus()
}
</script>

<template>
  <nav
    ref="navRef"
    :class="rootClass"
    :style="style"
    :aria-label="ariaLabel || t('component.index-nav.title')"
    data-component="IndexNav"
  >
    <button
      v-for="(item, index) in items"
      :key="String(item.value ?? index)"
      type="button"
      class="vp-index-nav__item"
      :class="{ 'vp-index-nav__item--active': isActive(item) }"
      :disabled="disabled || item.disabled"
      :aria-current="isActive(item) ? 'location' : undefined"
      :title="item.description || item.label"
      @click="onSelect(item, $event)"
      @keydown="onKeydown"
    >
      {{ item.label }}
    </button>
  </nav>
</template>
