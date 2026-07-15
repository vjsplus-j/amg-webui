<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { PopconfirmProps, PopconfirmEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<PopconfirmProps>(), {
  visible: false,
  placement: 'top',
  dismissible: true,
  disabled: false
})
const emit = defineEmits<PopconfirmEmits>()
const { t } = useLocale()

const rootRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

function open() {
  if (props.disabled) return
  emit('update:visible', true)
}

function close(e?: Event) {
  emit('update:visible', false)
  emit('cancel', e ?? new Event('cancel'))
}

function confirm(e: Event) {
  emit('confirm', e)
  emit('update:visible', false)
}

function onDocClick(e: MouseEvent) {
  if (!props.visible || !props.dismissible) return
  const target = e.target as Node
  if (rootRef.value?.contains(target) || panelRef.value?.contains(target)) return
  close(e)
}

function onKey(e: KeyboardEvent) {
  if (props.visible && props.dismissible && e.key === 'Escape') close(e)
}

const rootClass = computed(() => ['vp-popconfirm', { 'vp-popconfirm--open': props.visible }, props.class])

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
    <span class="vp-popconfirm__trigger" @click="open">
      <slot name="trigger" />
    </span>
    <Teleport to="body">
      <Transition name="vp-popconfirm-fade">
        <div v-if="visible" ref="panelRef" class="vp-popconfirm__panel" role="alertdialog" @click.stop>
          <p class="vp-popconfirm__message">
            <slot>{{ title }}</slot>
          </p>
          <div class="vp-popconfirm__actions">
            <button type="button" class="vp-popconfirm__btn vp-popconfirm__btn--ghost" @click="close">
              {{ t(LocaleKeys.button.cancel) }}
            </button>
            <button type="button" class="vp-popconfirm__btn vp-popconfirm__btn--primary" @click="confirm">
              {{ t(LocaleKeys.button.confirm) }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>
