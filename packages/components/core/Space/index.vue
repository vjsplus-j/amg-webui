<script setup lang="ts">
import { Comment, Fragment, Text, computed, useSlots, type Slot, type VNode } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { Size } from '@amg-webui/types'
import { SPACE_SIZES } from './types'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** xs 极小 · sm 小 · md 中 · lg 大 · xl 极大 */
    size?: Size | string
    gap?: Size | string
    gutter?: number | string
    direction?: 'horizontal' | 'vertical'
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
    wrap?: boolean
    block?: boolean
    ariaLabel?: string
    class?: string
    style?: Record<string, string>
  }>(),
  {
    size: 'md',
    direction: 'horizontal',
    wrap: true,
    block: false
  }
)

const slots = useSlots() as Readonly<Record<string, Slot | undefined>>
const { t } = useLocale()

const resolvedAriaLabel = computed(
  () => props.ariaLabel || t(LocaleKeys.component.space.aria)
)

const SIZE_GAP: Record<Size, string> = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)'
}

function resolveGap(raw: unknown): string {
  if (raw == null || raw === '') return SIZE_GAP.md
  if (typeof raw === 'number') {
    /* 0–4 → xs…xl */
    return SIZE_GAP[SPACE_SIZES[Math.min(Math.max(Math.floor(raw), 0), 4)]!] ?? SIZE_GAP.md
  }
  const s = String(raw)
  if (s in SIZE_GAP) return SIZE_GAP[s as Size]
  return s
}

function flattenChildren(nodes: VNode[] | undefined): VNode[] {
  const out: VNode[] = []
  for (const node of nodes ?? []) {
    if (node.type === Comment) continue
    if (node.type === Fragment && Array.isArray(node.children)) {
      out.push(...flattenChildren(node.children as VNode[]))
      continue
    }
    if (node.type === Text && !String(node.children ?? '').trim()) continue
    out.push(node)
  }
  return out
}

const sizeKey = computed(() => {
  const raw = props.gap ?? props.size ?? props.gutter ?? 'md'
  const s = String(raw)
  return (SPACE_SIZES as readonly string[]).includes(s) ? (s as Size) : null
})

const resolvedGap = computed(() =>
  resolveGap(props.gap ?? props.size ?? props.gutter ?? 'md')
)

const childNodes = computed(() => flattenChildren(slots.default?.()))

const hasSeparator = computed(() => Boolean(slots.separator))

const rootClass = computed(() => [
  'vp-space',
  `vp-space--${props.direction}`,
  sizeKey.value ? `vp-space--${sizeKey.value}` : '',
  {
    'vp-space--wrap': props.wrap !== false && props.direction === 'horizontal',
    'vp-space--block': props.block,
    'vp-space--split': hasSeparator.value
  },
  props.class
])

const rootStyle = computed(() => {
  const s: Record<string, string> = {
    ...(props.style || {}),
    gap: resolvedGap.value
  }
  if (props.align) {
    const map: Record<string, string> = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      baseline: 'baseline',
      stretch: 'stretch'
    }
    s.alignItems = map[props.align] ?? props.align
  }
  if (props.justify) {
    const map: Record<string, string> = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      'space-between': 'space-between',
      'space-around': 'space-around',
      'space-evenly': 'space-evenly'
    }
    s.justifyContent = map[props.justify] ?? props.justify
  }
  return s
})
</script>

<template>
  <div
    :class="rootClass"
    :style="rootStyle"
    role="group"
    :aria-label="resolvedAriaLabel"
  >
    <template v-if="hasSeparator">
      <template v-for="(child, i) in childNodes" :key="i">
        <div class="vp-space__item">
          <component :is="child" />
        </div>
        <span
          v-if="i < childNodes.length - 1"
          class="vp-space__separator"
          aria-hidden="true"
        >
          <slot name="separator" />
        </span>
      </template>
    </template>
    <slot v-else />
  </div>
</template>
