<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { SliderProps, SliderEmits, SliderValue } from './types'
import { useSlider } from './useSlider'
import { useFormItem } from '../FormItem/useFormItem'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'Slider' })

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  range: false,
  showTooltip: true
})

const emit = defineEmits<SliderEmits>()

const {
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  validateOnBlur,
  validateOnChange
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
  name: () => props.name
})

const {
  trackRef,
  dragging,
  values,
  percentLow,
  percentHigh,
  rootClass,
  valueFromClientX,
  emitValue
} = useSlider(props)

const update = (value: SliderValue) => {
  emit('update:modelValue', value)
  emit('change', value)
  void validateOnChange()
}

const startDrag = (which: 'low' | 'high' | 'single', event: PointerEvent) => {
  if (isDisabled.value) return
  event.preventDefault()
  event.stopPropagation()
  dragging.value = which
  ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
}

const onPointerMove = (event: PointerEvent) => {
  if (!dragging.value || isDisabled.value) return
  const val = valueFromClientX(event.clientX)
  const [low, high] = values.value
  if (dragging.value === 'low') {
    update(emitValue(Math.min(val, high), high))
  } else if (dragging.value === 'high') {
    update(emitValue(low, Math.max(val, low)))
  } else {
    update(val)
  }
}

const stopDrag = (event?: PointerEvent) => {
  if (event && dragging.value) {
    try {
      ;(event.currentTarget as HTMLElement | null)?.releasePointerCapture?.(event.pointerId)
    } catch {
      /* already released */
    }
  }
  dragging.value = null
}

const handleTrackPointer = (event: PointerEvent) => {
  if (isDisabled.value) return
  // Only react to primary button / touch / pen
  if (event.pointerType === 'mouse' && event.button !== 0) return
  const val = valueFromClientX(event.clientX)
  if (props.range) {
    const [low, high] = values.value
    const distLow = Math.abs(val - low)
    const distHigh = Math.abs(val - high)
    if (distLow <= distHigh) {
      update(emitValue(val, high))
      dragging.value = 'low'
    } else {
      update(emitValue(low, val))
      dragging.value = 'high'
    }
  } else {
    update(val)
    dragging.value = 'single'
  }
  ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
}

onMounted(() => {
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', stopDrag)
  document.addEventListener('pointercancel', stopDrag)
})

onUnmounted(() => {
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', stopDrag)
  document.removeEventListener('pointercancel', stopDrag)
})
const handleBlur = () => {
  void validateOnBlur()
}
</script>

<template>
  <div
    :id="inputId"
    :class="rootClass"
    :style="style"
    role="group"
    :aria-invalid="isInvalid || undefined"
    :aria-required="isRequired || undefined"
    :aria-describedby="ariaDescribedby"
    tabindex="0"
    @blur="handleBlur"
  >
    <div
      ref="trackRef"
      class="vp-slider__track"
      role="slider"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="range ? undefined : values[0]"
      :aria-disabled="isDisabled || undefined"
      @pointerdown="handleTrackPointer"
    >
      <div
        class="vp-slider__fill"
        :style="range
          ? { left: `${Math.min(percentLow, percentHigh)}%`, width: `${Math.abs(percentHigh - percentLow)}%` }
          : { left: '0%', width: `${percentLow}%` }"
      />
      <button
        type="button"
        class="vp-slider__thumb"
        :style="{ left: `${percentLow}%` }"
        :aria-valuenow="values[0]"
        @pointerdown="startDrag(range ? 'low' : 'single', $event)"
      >
        <span v-if="showTooltip" class="vp-slider__tooltip">{{ values[0] }}</span>
      </button>
      <button
        v-if="range"
        type="button"
        class="vp-slider__thumb"
        :style="{ left: `${percentHigh}%` }"
        :aria-valuenow="values[1]"
        @pointerdown="startDrag('high', $event)"
      >
        <span v-if="showTooltip" class="vp-slider__tooltip">{{ values[1] }}</span>
      </button>
    </div>
  </div>
</template>
