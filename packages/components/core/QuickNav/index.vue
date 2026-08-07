<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useNavSelection } from '@amg-webui/utils/nav'
import Icon from '@amg-webui/core/Icon/index.vue'
import type { QuickNavEmits, QuickNavProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<QuickNavProps>(), {
  items: () => [],
  variant: 'grid',
  columns: 4,
  showDescriptions: true,
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<QuickNavEmits>()
const { t } = useLocale()
const { selectItem, isActive } = useNavSelection(props, emit, 'QuickNav')

const safeColumns = computed(() => Math.min(8, Math.max(1, Math.round(props.columns))))
const rootClass = computed(() => [
  'vp-quick-nav',
  `vp-quick-nav--${props.variant}`,
  { 'vp-quick-nav--disabled': props.disabled },
  props.class
])
const rootStyle = computed(() => ({
  ...props.style,
  '--vp-quick-nav-columns': String(safeColumns.value)
}))
</script>

<template>
  <nav
    :class="rootClass"
    :style="rootStyle"
    :aria-label="ariaLabel || t('component.quick-nav.title')"
    data-component="QuickNav"
  >
    <button
      v-for="(item, index) in items"
      :key="String(item.value ?? index)"
      type="button"
      class="vp-quick-nav__item"
      :class="{ 'vp-quick-nav__item--active': isActive(item) }"
      :disabled="disabled || item.disabled"
      :aria-current="isActive(item) ? 'page' : undefined"
      @click="selectItem(item, $event)"
    >
      <span v-if="item.icon" class="vp-quick-nav__icon" aria-hidden="true">
        <Icon :name="item.icon" size="md" />
      </span>
      <span class="vp-quick-nav__content">
        <span class="vp-quick-nav__label">{{ item.label }}</span>
        <span
          v-if="showDescriptions && item.description"
          class="vp-quick-nav__description"
        >
          {{ item.description }}
        </span>
      </span>
      <span v-if="item.badge != null" class="vp-quick-nav__badge">{{ item.badge }}</span>
    </button>
  </nav>
</template>
