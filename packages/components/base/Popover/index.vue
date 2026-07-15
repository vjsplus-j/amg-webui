<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { PopoverProps, PopoverEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<PopoverProps>(), {
  visible: false,
  placement: 'top',
  dismissible: true,
  disabled: false
})
const emit = defineEmits<PopoverEmits>()
const { t } = useLocale()

const rootRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const rootClass = computed(() => [
  'vp-popover',
  `vp-popover--${props.placement}`,
  { 'vp-popover--open': props.visible },
  props.class
])

function toggle() {
  if (props.disabled) return
  emit('update:visible', !props.visible)
}

function close(_e?: Event) {
  emit('update:visible', false)
  emit('close')
}

function onDocClick(e: MouseEvent) {
  if (!props.visible || !props.dismissible) return
  const t = e.target as Node
  if (rootRef.value?.contains(t) || panelRef.value?.contains(t)) return
  close(e)
}

function onKey(e: KeyboardEvent) {
  if (props.visible && props.dismissible && e.key === 'Escape') close(e)
}

watch(() => props.visible, (v) => {
  if (!v) return
  requestAnimationFrame(() => panelRef.value?.focus())
})

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick, true)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <span ref="rootRef" :class="rootClass" :style="style">
    <span class="vp-popover__trigger" @click="toggle">
      <slot name="trigger" />
    </span>
    <Teleport to="body">
      <Transition name="vp-popover-fade">
        <div
          v-if="visible"
          ref="panelRef"
          class="vp-popover__panel"
          role="dialog"
          tabindex="-1"
          @click.stop
        >
          <header v-if="title || $slots.title" class="vp-popover__header">
            <slot name="title">{{ title }}</slot>
          </header>
          <div class="vp-popover__content">
            <slot />
          </div>
          <button
            v-if="dismissible"
            type="button"
            class="vp-popover__close"
            :aria-label="t(LocaleKeys.common.close)"
            @click="close"
          >×</button>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>
