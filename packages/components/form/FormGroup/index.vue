<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Icon from '@amg-webui/core/Icon/index.vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

const props = withDefaults(
  defineProps<{
    title?: string
    collapsible?: boolean
    collapsed?: boolean
    disabled?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    collapsible: true,
    collapsed: false,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
  toggle: [collapsed: boolean]
}>()

const { t } = useLocale()
const isCollapsed = ref(props.collapsed)
const panelId = `vp-form-group-panel-${Math.random().toString(36).slice(2, 9)}`

watch(
  () => props.collapsed,
  (val) => {
    isCollapsed.value = val
  }
)

const titleText = computed(() => props.title ?? t('component.form-group.title'))

const chevronClass = computed(() =>
  [
    'vp-form-group__chevron',
    isCollapsed.value ? 'vp-form-group__chevron--collapsed' : ''
  ]
    .filter(Boolean)
    .join(' ')
)

function toggle() {
  if (!props.collapsible || props.disabled) return
  isCollapsed.value = !isCollapsed.value
  trackEmit({
    component: 'FormGroup',
    type: 'toggle',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { collapsed: isCollapsed.value }
  })
  emit('update:collapsed', isCollapsed.value)
  emit('toggle', isCollapsed.value)
}
</script>

<template>
  <section
    :class="[
      'vp-form-group',
      {
        'vp-form-group--collapsed': isCollapsed,
        'vp-form-group--disabled': disabled,
        'vp-form-group--open': !isCollapsed
      },
      props.class
    ]"
    :style="style"
    data-component="FormGroup"
  >
    <header class="vp-form-group__header">
      <button
        v-if="collapsible"
        type="button"
        class="vp-form-group__toggle"
        :disabled="disabled"
        :aria-expanded="!isCollapsed"
        :aria-controls="panelId"
        @click="toggle"
      >
        <Icon
          name="ChevronDown"
          size="sm"
          :class="chevronClass"
          aria-hidden="true"
        />
        <h3 class="vp-form-group__title">{{ titleText }}</h3>
      </button>
      <h3 v-else class="vp-form-group__title">{{ titleText }}</h3>
      <slot name="extra" />
    </header>
    <div
      :id="panelId"
      v-show="!isCollapsed"
      class="vp-form-group__body"
      role="region"
      :aria-label="titleText"
    >
      <slot />
    </div>
  </section>
</template>
