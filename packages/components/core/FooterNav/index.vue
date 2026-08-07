<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useNavSelection, type NavItem } from '@amg-webui/utils/nav'
import Icon from '@amg-webui/core/Icon/index.vue'
import type { FooterNavEmits, FooterNavProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<FooterNavProps>(), {
  items: () => [],
  align: 'start',
  dividers: false,
  wrap: true,
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<FooterNavEmits>()
const { t } = useLocale()
const { selectItem, isActive } = useNavSelection(props, emit, 'FooterNav')

const rootClass = computed(() => [
  'vp-footer-nav',
  `vp-footer-nav--${props.align}`,
  {
    'vp-footer-nav--dividers': props.dividers,
    'vp-footer-nav--nowrap': !props.wrap,
    'vp-footer-nav--disabled': props.disabled
  },
  props.class
])

function isLink(item: NavItem) {
  return Boolean(item.href)
}

function linkRel(item: NavItem) {
  if (item.rel) return item.rel
  return item.target === '_blank' ? 'noopener noreferrer' : undefined
}

function onSelect(item: NavItem, event: MouseEvent) {
  if (props.disabled || item.disabled) {
    event.preventDefault()
    return
  }
  selectItem(item, event)
}
</script>

<template>
  <nav
    :class="rootClass"
    :style="style"
    :aria-label="ariaLabel || t('component.footer-nav.title')"
    data-component="FooterNav"
  >
    <component
      :is="isLink(item) ? 'a' : 'button'"
      v-for="(item, index) in items"
      :key="String(item.value ?? index)"
      class="vp-footer-nav__item"
      :class="{ 'vp-footer-nav__item--active': isActive(item) }"
      :type="isLink(item) ? undefined : 'button'"
      :href="isLink(item) ? item.href : undefined"
      :target="isLink(item) ? item.target : undefined"
      :rel="isLink(item) ? linkRel(item) : undefined"
      :disabled="!isLink(item) && (disabled || item.disabled) ? true : undefined"
      :aria-disabled="isLink(item) && (disabled || item.disabled) ? true : undefined"
      :aria-current="isActive(item) ? 'page' : undefined"
      @click="onSelect(item, $event)"
    >
      <Icon v-if="item.icon" :name="item.icon" size="sm" aria-hidden="true" />
      <span>{{ item.label }}</span>
      <Icon
        v-if="item.target === '_blank'"
        class="vp-footer-nav__external"
        name="ExternalLink"
        size="xs"
        aria-hidden="true"
      />
    </component>
  </nav>
</template>
