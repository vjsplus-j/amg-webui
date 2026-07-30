<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import Icon from '../Icon/index.vue'
import type { SegmentedProps, SegmentedEmits, SegmentedOption } from './types'
import './style.scss'

const props = withDefaults(defineProps<SegmentedProps>(), {
  options: () => [],
  size: 'md',
  block: false,
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<SegmentedEmits>()
const { t } = useLocale()

const optionList = computed(() => props.options ?? [])

const rootClass = computed(() => [
  'vp-segmented',
  `vp-segmented--size-${props.size}`,
  {
    'vp-segmented--block': props.block,
    'vp-segmented--disabled': props.disabled
  },
  props.class
])

const isSelected = (opt: SegmentedOption) => props.modelValue === opt.value

const isOptionDisabled = (opt: SegmentedOption) =>
  Boolean(props.disabled || opt.disabled)

const select = (opt: SegmentedOption) => {
  if (isOptionDisabled(opt) || isSelected(opt)) return
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
  trackEmit({
    component: 'Segmented',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value: opt.value }
  })
}

const enabledIndices = computed(() =>
  optionList.value
    .map((opt, idx) => (!isOptionDisabled(opt) ? idx : -1))
    .filter((idx) => idx >= 0)
)

const currentIndex = computed(() =>
  optionList.value.findIndex((opt) => opt.value === props.modelValue)
)

const moveSelection = (direction: 1 | -1) => {
  const enabled = enabledIndices.value
  if (!enabled.length) return

  let idx = enabled.indexOf(currentIndex.value)
  if (idx < 0) idx = direction === 1 ? -1 : enabled.length

  const nextIdx = (idx + direction + enabled.length) % enabled.length
  const target = optionList.value[enabled[nextIdx]]
  if (target) select(target)
}

const onKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      moveSelection(1)
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      moveSelection(-1)
      break
    case 'Home':
      event.preventDefault()
      if (enabledIndices.value.length) {
        select(optionList.value[enabledIndices.value[0]])
      }
      break
    case 'End':
      event.preventDefault()
      if (enabledIndices.value.length) {
        const last = enabledIndices.value[enabledIndices.value.length - 1]
        select(optionList.value[last])
      }
      break
  }
}

const onOptionKeydown = (event: KeyboardEvent, opt: SegmentedOption) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    select(opt)
  } else {
    onKeydown(event)
  }
}
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    role="radiogroup"
    :aria-label="ariaLabel ?? t(LocaleKeys.component.segmented.aria)"
    :aria-disabled="disabled || undefined"
    data-component="Segmented"
    @keydown="onKeydown"
  >
    <button
      v-for="(opt, idx) in optionList"
      :key="`${String(opt.value)}-${idx}`"
      type="button"
      role="radio"
      class="vp-segmented__item"
      :class="{
        'vp-segmented__item--selected': isSelected(opt),
        'vp-segmented__item--disabled': isOptionDisabled(opt)
      }"
      :aria-checked="isSelected(opt)"
      :aria-disabled="isOptionDisabled(opt) || undefined"
      :disabled="isOptionDisabled(opt)"
      :name="name"
      :tabindex="isSelected(opt) ? 0 : -1"
      @click="select(opt)"
      @keydown="onOptionKeydown($event, opt)"
    >
      <Icon
        v-if="opt.icon"
        class="vp-segmented__icon"
        :name="opt.icon"
        size="sm"
        aria-hidden="true"
      />
      <span class="vp-segmented__label">{{ opt.label }}</span>
    </button>
  </div>
</template>
