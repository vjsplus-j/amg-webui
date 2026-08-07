<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { DragVerifyProps, DragVerifyEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragVerifyProps>(), {
  modelValue: false,
  disabled: false,
  threshold: 0.92,
  width: '100%',
  resetOnFail: true,
  keyboardStep: 12
})

const emit = defineEmits<DragVerifyEmits>()
const { t } = useLocale()
const trackRef = ref<HTMLElement | null>(null)
const offset = ref(0)
const dragging = ref(false)
const startX = ref(0)

const passed = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})
const progress = computed(() => Math.round((offset.value / Math.max(1, maxOffset.value)) * 100))
const rootStyle = computed(() => ({
  ...props.style,
  '--vp-drag-verify-width': props.width
}))

const maxOffset = computed(() => {
  const track = trackRef.value
  if (!track) return 200
  return Math.max(0, track.clientWidth - 44)
})

function onPointerDown(e: PointerEvent) {
  if (props.disabled || passed.value) return
  dragging.value = true
  startX.value = e.clientX - offset.value
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  offset.value = Math.max(0, Math.min(maxOffset.value, e.clientX - startX.value))
  emitChange()
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value) return
  dragging.value = false
  ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  if (offset.value >= maxOffset.value * props.threshold) {
    offset.value = maxOffset.value
    passed.value = true
    emit('success')
    emitChange()
  } else {
    if (props.resetOnFail) offset.value = 0
    emit('fail')
    emitChange()
  }
}

function emitChange() {
  emit('change', { passed: passed.value, offset: offset.value, progress: progress.value })
}

function reset() {
  offset.value = 0
  passed.value = false
  emit('reset')
  emitChange()
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled || passed.value) return
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    offset.value = Math.min(maxOffset.value, offset.value + props.keyboardStep)
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    offset.value = Math.max(0, offset.value - props.keyboardStep)
  } else if (event.key === 'Home') {
    event.preventDefault()
    offset.value = 0
  } else if (event.key === 'End') {
    event.preventDefault()
    offset.value = maxOffset.value
  } else {
    return
  }
  if (offset.value >= maxOffset.value * props.threshold) {
    offset.value = maxOffset.value
    passed.value = true
    emit('success')
  }
  emitChange()
}

defineExpose({ reset })
</script>

<template>
  <div
    :class="['vp-drag-verify', { 'vp-drag-verify--passed': passed, 'vp-drag-verify--disabled': disabled }, props.class]"
    :style="rootStyle"
    data-component="DragVerify"
  >
    <div ref="trackRef" class="vp-drag-verify__track">
      <span class="vp-drag-verify__hint">{{ passed ? t('auth.captchaPass') : t('auth.slideToVerify') }}</span>
      <div
        class="vp-drag-verify__thumb"
        role="slider"
        :style="{ transform: `translateX(${offset}px)` }"
        :aria-label="t(LocaleKeys.component.dragVerify.sliderAria, { progress })"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-disabled="disabled || passed || undefined"
        tabindex="0"
        @keydown="onKeydown"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />
    </div>
  </div>
</template>
