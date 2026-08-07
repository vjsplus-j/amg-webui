<script setup lang="ts">
import { ref, computed, useSlots, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import Icon from '@amg-webui/core/Icon/index.vue'
import type { FloatButtonProps, FloatButtonEmits } from './types'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

const props = withDefaults(defineProps<FloatButtonProps>(), {
  telemetry: undefined,
  severity: 'primary',
  shape: 'circle'
})

const emit = defineEmits<FloatButtonEmits>()
const { t } = useLocale()
const slots = useSlots()

const innerOpen = ref(false)
const hasMenu = computed(() => !!slots.menu)
const menuOpen = computed(() =>
  props.open !== undefined ? props.open : innerOpen.value
)

const resolvedSeverity = computed(() => props.type ?? props.severity ?? 'primary')

/** Map numeric offsets to spacing-token multiples (avoid raw px). */
function toPos(val?: string | number): string | undefined {
  if (val == null) return undefined
  if (typeof val === 'number') {
    return `calc(var(--spacing-xs) * ${Math.max(0, val)})`
  }
  return val
}

const posStyle = computed(() => ({
  '--vp-float-top': toPos(props.top) ?? 'auto',
  '--vp-float-right': toPos(props.right) ?? 'var(--spacing-xl)',
  '--vp-float-bottom': toPos(props.bottom) ?? 'var(--spacing-xl)',
  '--vp-float-left': toPos(props.left) ?? 'auto'
}))

const triggerClass = computed(() => [
  'vp-float-button__trigger',
  `vp-float-button__trigger--${resolvedSeverity.value}`,
  `vp-float-button__trigger--${props.shape}`
])

function setMenuOpen(next: boolean) {
  if (props.open === undefined) innerOpen.value = next
  trackEmit({
    component: 'FloatButton',
    type: 'openChange',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { open: next }
  })
  emit('update:open', next)
  emit('openChange', next)
}

function handleClick(event: MouseEvent) {
  if (hasMenu.value) {
    setMenuOpen(!menuOpen.value)
  }
  trackEmit({
    component: 'FloatButton',
    type: 'click',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
  emit('click', event)
}

watch(
  () => props.open,
  (v) => {
    if (v !== undefined) innerOpen.value = v
  }
)

const expandLabel = computed(() => t('common.more', undefined, 'More'))
const triggerAriaLabel = computed(
  () => props.ariaLabel || (hasMenu.value ? expandLabel.value : expandLabel.value)
)
</script>

<template>
  <div :class="['vp-float-button', props.class]" :style="{ ...posStyle, ...style }">
    <div v-if="menuOpen && $slots.menu" class="vp-float-button__menu">
      <slot name="menu" />
    </div>

    <component
      :is="href ? 'a' : 'button'"
      :class="triggerClass"
      :href="href"
      type="button"
      :aria-label="triggerAriaLabel"
      :aria-expanded="hasMenu ? menuOpen : undefined"
      @click="handleClick"
    >
      <span v-if="icon || $slots.icon" class="vp-float-button__icon">
        <slot name="icon">
          <Icon v-if="icon" :name="icon" size="md" />
        </slot>
      </span>
      <slot v-else />
    </component>

    <div v-if="$slots.description" class="vp-float-button__description">
      <slot name="description" />
    </div>
  </div>
</template>
