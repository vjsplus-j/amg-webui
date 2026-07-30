<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AffixEmits, AffixProps } from './types'
import { useAffix } from './useAffix'
import './style.scss'

const props = withDefaults(defineProps<AffixProps>(), {
  offsetTop: 0,
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<AffixEmits>()
const contentRef = ref<HTMLElement | null>(null)

const { affixed, placeholderHeight, placeholderWidth, fixedStyle } = useAffix(
  props,
  contentRef,
  (value) => emit('change', value),
  (payload) => emit('scroll', payload)
)

const rootStyle = computed(() => ({
  ...props.style,
  ...(props.zIndex !== undefined ? { '--vp-affix-z-index': String(props.zIndex) } : {})
}))
</script>

<template>
  <div
    class="vp-affix"
    :class="props.class"
    :style="rootStyle"
    data-component="Affix"
  >
    <div
      v-if="affixed && !disabled"
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
      :class="{ 'vp-affix__content--fixed': affixed && !disabled, 'vp-affix--fixed': affixed && !disabled }"
      :style="affixed && !disabled ? fixedStyle : undefined"
    >
      <slot />
    </div>
  </div>
</template>
