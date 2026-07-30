<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { hasLucideIcon } from '@amg-webui/icons'
import { useNavSelection, type NavItem } from '@amg-webui/utils/nav'
import Icon from '../Icon/index.vue'
import type { FloatNavProps, FloatNavEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<FloatNavProps>(), {
  items: () => [],
  direction: 'vertical',
  placement: 'bottom-right',
  teleport: true,
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<FloatNavEmits>()
const { t } = useLocale()
const { selectItem, isActive } = useNavSelection(props, emit, 'FloatNav')

const rootRef = ref<HTMLElement | null>(null)

const resolvedAria = computed(
  () => props.ariaLabel || t('component.float-nav.title')
)

const rootClass = computed(() => [
  'vp-float-nav',
  `vp-float-nav--${props.direction}`,
  `vp-float-nav--${props.placement}`,
  { 'vp-float-nav--disabled': props.disabled },
  props.class
])

function iconName(item: NavItem): string | undefined {
  if (!item.icon) return undefined
  return hasLucideIcon(item.icon) ? item.icon : undefined
}

function focusableButtons(): HTMLButtonElement[] {
  if (!rootRef.value) return []
  return Array.from(
    rootRef.value.querySelectorAll<HTMLButtonElement>(
      '.vp-float-nav__fab:not(:disabled)'
    )
  )
}

function onFabKeydown(event: KeyboardEvent, index: number) {
  const keys = focusableButtons()
  if (!keys.length) return
  const item = props.items[index]
  if (!item) return

  let next = -1
  const vertical = props.direction === 'vertical'
  if (
    (vertical && event.key === 'ArrowDown') ||
    (!vertical && event.key === 'ArrowRight')
  ) {
    next = (index + 1) % props.items.length
  } else if (
    (vertical && event.key === 'ArrowUp') ||
    (!vertical && event.key === 'ArrowLeft')
  ) {
    next = (index - 1 + props.items.length) % props.items.length
  } else if (event.key === 'Home') {
    next = 0
  } else if (event.key === 'End') {
    next = props.items.length - 1
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectItem(item, event as unknown as MouseEvent)
    return
  } else {
    return
  }

  event.preventDefault()
  // skip disabled
  let guard = 0
  while (guard < props.items.length) {
    const candidate = props.items[next]
    if (candidate && !candidate.disabled) {
      keys.find((btn) => btn.dataset.index === String(next))?.focus()
      break
    }
    next =
      event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'End'
        ? (next - 1 + props.items.length) % props.items.length
        : (next + 1) % props.items.length
    guard++
  }
}
</script>

<template>
  <Teleport to="body" :disabled="!teleport">
    <nav
      ref="rootRef"
      :class="rootClass"
      :style="style"
      role="navigation"
      data-component="FloatNav"
      :aria-label="resolvedAria"
    >
      <button
        v-for="(item, i) in items"
        :key="i"
        type="button"
        class="vp-float-nav__fab"
        :class="{ 'vp-float-nav__fab--active': isActive(item) }"
        :data-index="i"
        :disabled="disabled || item.disabled"
        :title="item.label"
        :aria-label="item.label"
        :aria-current="isActive(item) ? 'true' : undefined"
        @click="selectItem(item, $event)"
        @keydown="onFabKeydown($event, i)"
      >
        <Icon v-if="iconName(item)" :name="iconName(item)!" size="sm" aria-hidden="true" />
        <span v-else aria-hidden="true">{{ item.icon ?? item.label.charAt(0) }}</span>
      </button>
    </nav>
  </Teleport>
</template>
