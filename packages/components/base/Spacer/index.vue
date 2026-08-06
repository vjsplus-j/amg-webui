<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { SpacerEmits, SpacerProps } from './types'
import { useSpacerStyle } from './useSpacerStyle'
import './style.scss'

const props = withDefaults(
  defineProps<SpacerProps>(),
  {
    flex: true,
    grow: 1,
    shrink: 1,
    axis: 'horizontal',
    inline: false,
    ariaHidden: true,
    observeResize: false
  }
)

const emit = defineEmits<SpacerEmits>()
const rootRef = ref<HTMLElement | null>(null)
const { rootClass, rootStyle } = useSpacerStyle(props)
const rootRole = computed(() => (props.ariaHidden ? 'none' : undefined))
const resolvedTabIndex = computed(() => (props.ariaHidden ? undefined : props.tabIndex))
let observer: ResizeObserver | undefined

onMounted(() => {
  if (!props.observeResize || typeof ResizeObserver === 'undefined' || !rootRef.value) return
  observer = new ResizeObserver(([entry]) => {
    emit('resize', {
      width: entry.contentRect.width,
      height: entry.contentRect.height
    })
  })
  observer.observe(rootRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="rootRef"
    :class="rootClass"
    :style="rootStyle"
    data-component="Spacer"
    :role="rootRole"
    :aria-hidden="ariaHidden"
    :tabindex="resolvedTabIndex"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  />
</template>
