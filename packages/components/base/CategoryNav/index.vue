<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useNavSelection } from '@amg-webui/utils/nav'
import Icon from '../Icon/index.vue'
import type { CategoryNavEmits, CategoryNavProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<CategoryNavProps>(), {
  items: () => [],
  variant: 'pills',
  size: 'md',
  wrap: true,
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<CategoryNavEmits>()
const { t } = useLocale()
const navRef = ref<HTMLElement | null>(null)
const { selectItem, isActive } = useNavSelection(props, emit, 'CategoryNav')

const rootClass = computed(() => [
  'vp-category-nav',
  `vp-category-nav--${props.variant}`,
  `vp-category-nav--${props.size}`,
  {
    'vp-category-nav--nowrap': !props.wrap,
    'vp-category-nav--disabled': props.disabled
  },
  props.class
])

function onKeydown(event: KeyboardEvent) {
  const buttons = navRef.value?.querySelectorAll<HTMLButtonElement>(
    '.vp-category-nav__item:not(:disabled)'
  )
  if (!buttons?.length) return
  const current = Array.from(buttons).indexOf(event.currentTarget as HTMLButtonElement)
  if (current < 0) return
  let next = current
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % buttons.length
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + buttons.length) % buttons.length
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
    :aria-label="ariaLabel || t('component.category-nav.title')"
    data-component="CategoryNav"
  >
    <button
      v-for="(item, index) in items"
      :key="String(item.value ?? index)"
      type="button"
      class="vp-category-nav__item"
      :class="{ 'vp-category-nav__item--active': isActive(item) }"
      :disabled="disabled || item.disabled"
      :aria-current="isActive(item) ? 'page' : undefined"
      @click="selectItem(item, $event)"
      @keydown="onKeydown"
    >
      <Icon v-if="item.icon" class="vp-category-nav__icon" :name="item.icon" size="sm" />
      <span class="vp-category-nav__content">
        <span class="vp-category-nav__label">{{ item.label }}</span>
        <span v-if="item.description" class="vp-category-nav__description">
          {{ item.description }}
        </span>
      </span>
      <span v-if="item.badge != null" class="vp-category-nav__badge">{{ item.badge }}</span>
    </button>
  </nav>
</template>
