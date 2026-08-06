<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AffixEmits, AffixProps } from './types'
import { useAffix } from './useAffix'
import './style.scss'

const props = withDefaults(defineProps<AffixProps>(), {
  offsetTop: 0,
  disabled: false,
  placeholder: true,
  ariaLive: 'off',
  telemetry: undefined
})

const emit = defineEmits<AffixEmits>()
const contentRef = ref<HTMLElement | null>(null)

const { affixed, placeholderHeight, placeholderWidth, fixedStyle, update } = useAffix(
  props,
  contentRef,
  (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
  (payload) => emit('scroll', payload)
)

const visibleAffixed = computed(() => props.modelValue ?? affixed.value)
const isFixed = computed(() => visibleAffixed.value && !props.disabled)
const rootStyle = computed(() => ({
  ...props.style,
  ...(props.zIndex !== undefined ? { '--vp-affix-z-index': String(props.zIndex) } : {})
}))

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

defineExpose({ update, affixed: visibleAffixed })
</script>

<template>
  <div
    class="vp-affix"
    :class="props.class"
    :style="rootStyle"
    data-component="Affix"
    :data-affixed="isFixed"
    :aria-live="ariaLive"
    @focusin="handleFocus"
    @focusout="handleBlur"
  >
    <div
      v-if="isFixed && placeholder"
      class="vp-affix__placeholder"
      :style="{
        width: `${placeholderWidth}px`,
        height: `${placeholderHeight}px`
      }"
      aria-hidden="true"
    />
    <div
      ref="contentRef"
      class="vp-affix__content"
      :class="[
        {
          'vp-affix__content--fixed': isFixed,
          'vp-affix--fixed': isFixed
        },
        isFixed ? affixedClass : undefined
      ]"
      :style="isFixed ? fixedStyle : undefined"
    >
      <slot :affixed="isFixed" :update="update" />
    </div>
  </div>
</template>
