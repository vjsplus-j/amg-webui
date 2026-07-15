<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { DragVerifyProps, DragVerifyEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragVerifyProps>(), {
  modelValue: false,
  disabled: false
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

const maxOffset = computed(() => {
  const track = trackRef.value
  if (!track) return 200
  return track.clientWidth - 44
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
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value) return
  dragging.value = false
  ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  if (offset.value >= maxOffset.value * 0.92) {
    offset.value = maxOffset.value
    passed.value = true
    emit('success')
  } else {
    offset.value = 0
  }
}
</script>

<template>
  <div :class="['vp-drag-verify', { 'vp-drag-verify--passed': passed, 'vp-drag-verify--disabled': disabled }, props.class]" :style="style" data-component="DragVerify">
    <div ref="trackRef" class="vp-drag-verify__track">
      <span class="vp-drag-verify__hint">{{ passed ? t('auth.captchaPass') : t('auth.slideToVerify') }}</span>
      <button
        type="button"
        class="vp-drag-verify__thumb"
        :style="{ transform: `translateX(${offset}px)` }"
        :disabled="disabled || passed"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
      />
    </div>
  </div>
</template>
