<script setup lang="ts">
/**
 * Divider — a11y via role=separator / aria-orientation (or decorative aria-hidden).
 */
import { computed, useSlots } from 'vue'
import type { DividerContentPosition, DividerDirection, DividerMargin } from './types'
import { useDivider } from './useDivider'
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
    plain?: boolean
    margin?: DividerMargin
    /** Purely visual — hide from accessibility tree */
    decorative?: boolean
    ariaLabel?: string
    class?: string
    style?: Record<string, string>
  }>(),
  {
    contentPosition: 'center',
    dashed: false,
    plain: false,
    margin: 'md',
    decorative: false
  }
)

const slots = useSlots()

const hasText = computed(
  () => Boolean(slots.default) && (props.direction ?? props.type ?? 'horizontal') === 'horizontal'
)

const { axis, a11yAttrs } = useDivider(
  computed(() => ({
    direction: props.direction,
    type: props.type,
    margin: props.margin,
    dashed: props.dashed,
    plain: props.plain,
    decorative: props.decorative,
    ariaLabel: props.ariaLabel,
    hasText: hasText.value
  }))
)

const dividerClass = computed(() => [
  'vp-divider',
  `vp-divider--${axis.value}`,
  `vp-divider--${props.contentPosition}`,
  `vp-divider--margin-${props.margin}`,
  {
    'vp-divider--dashed': props.dashed,
    'vp-divider--plain': props.plain,
    'vp-divider--with-text': hasText.value,
    'vp-divider--decorative': props.decorative
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
    v-if="hasText"
    :class="dividerClass"
    :style="dividerStyle"
    v-bind="a11yAttrs"
  >
    <span class="vp-divider__text"><slot /></span>
  </div>
  <hr
    v-else
    :class="dividerClass"
    :style="dividerStyle"
    v-bind="a11yAttrs"
  />
</template>
