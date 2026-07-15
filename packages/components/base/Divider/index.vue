<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { DividerContentPosition, DividerDirection } from './types'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Layout axis — `vertical` renders an inline pipe `|` separator */
    direction?: DividerDirection
    /**
     * Alias of `direction` (Ant Design–style).
     * Ignored when `direction` is set.
     */
    type?: DividerDirection
    contentPosition?: DividerContentPosition
    dashed?: boolean
    borderStyle?: string
    class?: string
    style?: Record<string, string>
  }>(),
  {
    contentPosition: 'center',
    dashed: false
  }
)

const slots = useSlots()

const axis = computed<DividerDirection>(
  () => props.direction ?? props.type ?? 'horizontal'
)

const dividerClass = computed(() => [
  'vp-divider',
  `vp-divider--${axis.value}`,
  `vp-divider--${props.contentPosition}`,
  {
    'vp-divider--dashed': props.dashed,
    'vp-divider--with-text': Boolean(slots.default) && axis.value === 'horizontal'
  },
  props.class
])

const dividerStyle = computed(() => ({
  ...props.style,
  ...(props.borderStyle ? { borderStyle: props.borderStyle } : {})
}))
</script>

<template>
  <div
    v-if="axis === 'horizontal' && $slots.default"
    :class="dividerClass"
    :style="dividerStyle"
    role="separator"
    aria-orientation="horizontal"
  >
    <span class="vp-divider__text"><slot /></span>
  </div>
  <hr
    v-else
    :class="dividerClass"
    :style="dividerStyle"
    role="separator"
    :aria-orientation="axis"
  />
</template>
