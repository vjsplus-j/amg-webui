<script setup lang="ts">
import { computed } from 'vue'
import type { TooltipProps } from './types'
import { useTooltip } from './useTooltip'
import './style.scss'

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  disabled: false,
  delay: 0
})

const { visible, show, hide } = useTooltip(props)

const tooltipClass = computed(() => [
  'vp-tooltip',
  `vp-tooltip--${props.placement}`,
  props.class
])
</script>

<template>
  <span
    class="vp-tooltip-trigger"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
    <Transition name="vp-tooltip-fade">
      <span
        v-if="visible && (content || $slots.content)"
        :class="tooltipClass"
        :style="style"
        role="tooltip"
      >
        <slot name="content">{{ content }}</slot>
        <span class="vp-tooltip__arrow" aria-hidden="true" />
      </span>
    </Transition>
  </span>
</template>
