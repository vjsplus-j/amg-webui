<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, watch } from 'vue'
import Icon from '../Icon/index.vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import { LAYOUT_INJECTION_KEY } from '../Layout/types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    width?: string
    collapsedWidth?: string
    collapsed?: boolean
    collapsible?: boolean
    side?: 'left' | 'right'
    bordered?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    width: 'var(--ln-sidebar-width)',
    collapsedWidth: 'var(--ln-sidebar-width-collapsed)',
    collapsed: false,
    collapsible: true,
    side: 'left',
    bordered: true,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
  collapse: [collapsed: boolean]
}>()

const { t } = useLocale()
const layout = inject(LAYOUT_INJECTION_KEY, null)

onMounted(() => layout?.registerSider())
onUnmounted(() => layout?.unregisterSider())

const isCollapsed = computed(() => props.collapsed)

watch(
  () => props.collapsed,
  () => {
    /* sync from parent v-model */
  }
)

function toggle() {
  if (!props.collapsible) return
  const next = !isCollapsed.value
  trackEmit({
    component: 'Sider',
    type: 'collapse',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { collapsed: next }
  })
  emit('update:collapsed', next)
  emit('collapse', next)
}

const rootClass = computed(() => [
  'vp-sider',
  `vp-sider--${props.side}`,
  {
    'vp-sider--collapsed': isCollapsed.value,
    'vp-sider--bordered': props.bordered
  },
  props.class
])

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  width: isCollapsed.value ? props.collapsedWidth : props.width,
  flex: `0 0 ${isCollapsed.value ? props.collapsedWidth : props.width}`
}))

const toggleLabel = computed(() =>
  isCollapsed.value
    ? t(LocaleKeys.common.expandMenu)
    : t(LocaleKeys.common.collapseMenu)
)
</script>

<template>
  <aside
    :class="rootClass"
    :style="rootStyle"
    data-component="Sider"
    :aria-expanded="!isCollapsed"
  >
    <div v-if="$slots.header || collapsible" class="vp-sider__header">
      <div class="vp-sider__brand">
        <slot name="header" />
      </div>
      <button
        v-if="collapsible"
        type="button"
        class="vp-sider__toggle"
        :title="toggleLabel"
        :aria-label="toggleLabel"
        @click="toggle"
      >
        <Icon
          :name="
            isCollapsed
              ? side === 'right'
                ? 'ChevronLeft'
                : 'ChevronRight'
              : side === 'right'
                ? 'ChevronRight'
                : 'ChevronLeft'
          "
          size="sm"
        />
      </button>
    </div>

    <div class="vp-sider__body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="vp-sider__footer">
      <slot name="footer" />
    </div>
  </aside>
</template>
