<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useNavSelection } from '@amg-webui/utils/nav'
import Icon from '@amg-webui/core/Icon/index.vue'
import type { MiniNavEmits, MiniNavProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<MiniNavProps>(), {
  items: () => [],
  collapsed: false,
  showBadges: true,
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<MiniNavEmits>()
const { t } = useLocale()
const { selectItem, isActive } = useNavSelection(props, emit, 'MiniNav')

const rootClass = computed(() => [
  'vp-mini-nav',
  {
    'vp-mini-nav--collapsed': props.collapsed,
    'vp-mini-nav--disabled': props.disabled
  },
  props.class
])

function fallbackMark(label: string) {
  return Array.from(label.trim())[0]?.toLocaleUpperCase() ?? '•'
}
</script>

<template>
  <nav
    :class="rootClass"
    :style="style"
    :aria-label="ariaLabel || t('component.mini-nav.title')"
    data-component="MiniNav"
  >
    <template v-for="(item, index) in items" :key="String(item.value ?? index)">
      <div v-if="item.type === 'divider'" class="vp-mini-nav__divider" role="separator" />
      <p v-else-if="item.type === 'group'" class="vp-mini-nav__group">
        {{ collapsed ? fallbackMark(item.label) : item.label }}
      </p>
      <button
        v-else
        type="button"
        class="vp-mini-nav__item"
        :class="{ 'vp-mini-nav__item--active': isActive(item) }"
        :disabled="disabled || item.disabled"
        :aria-current="isActive(item) ? 'page' : undefined"
        :aria-label="collapsed ? item.label : undefined"
        :title="collapsed ? item.label : item.description"
        @click="selectItem(item, $event)"
      >
        <span class="vp-mini-nav__mark" aria-hidden="true">
          <Icon v-if="item.icon" :name="item.icon" size="sm" />
          <span v-else>{{ fallbackMark(item.label) }}</span>
        </span>
        <span v-if="!collapsed" class="vp-mini-nav__label">{{ item.label }}</span>
        <span
          v-if="!collapsed && showBadges && item.badge != null"
          class="vp-mini-nav__badge"
        >
          {{ item.badge }}
        </span>
      </button>
    </template>
  </nav>
</template>
