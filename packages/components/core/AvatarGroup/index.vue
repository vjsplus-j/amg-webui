<script setup lang="ts">
import {
  computed,
  cloneVNode,
  inject,
  provide,
  useSlots,
  Fragment,
  Comment,
  Text,
  type Slot,
  type VNode
} from 'vue'
import type { AvatarGroupProps } from './types'
import { AVATAR_GROUP_CONFIG_KEY } from './config'
import { AVATAR_GROUP_KEY } from '../Avatar/config'
import Avatar from '../Avatar/index.vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Tooltip from '../Tooltip/index.vue'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

const props = withDefaults(
  defineProps<
    AvatarGroupProps & {
      variant?: 'default' | 'neon'
    }
  >(),
  {
  telemetry: undefined,
    max: undefined,
    size: undefined,
    shape: undefined,
    variant: undefined,
    disabled: false
  }
)

/** Inline tuple emits: Vite compiler-sfc fails on imported emit type aliases. */
const emit = defineEmits<{
  overflowClick: [event: MouseEvent]
}>()
const slots = useSlots() as Readonly<{
  default?: Slot
  overflowTooltip?: Slot
}>
const { t } = useLocale()
const globalConfig = inject(AVATAR_GROUP_CONFIG_KEY, {})

const resolvedMax = computed(() => props.max ?? globalConfig.max ?? 3)
const resolvedSize = computed(() => props.size ?? globalConfig.size)
const resolvedShape = computed(() => props.shape ?? globalConfig.shape)
const resolvedDisabled = computed(() => Boolean(props.disabled))
const resolvedOverlap = computed(() => props.overlap ?? globalConfig.overlap)
const resolvedVariant = computed(() => props.variant ?? 'default')

provide(AVATAR_GROUP_KEY, {
  size: resolvedSize,
  shape: resolvedShape,
  disabled: resolvedDisabled,
  variant: resolvedVariant
})

function flattenVNodes(vnodes: VNode[]): VNode[] {
  const result: VNode[] = []
  for (const vnode of vnodes) {
    if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      result.push(...flattenVNodes(vnode.children as VNode[]))
    } else if (
      vnode.type !== Comment &&
      !(vnode.type === Text && !String(vnode.children ?? '').trim())
    ) {
      result.push(vnode)
    }
  }
  return result
}

function avatarLabel(vnode: VNode): string {
  const p = (vnode.props ?? {}) as Record<string, unknown>
  const raw = p.tooltip ?? p.alt ?? p.text ?? p['aria-label']
  return typeof raw === 'string' ? raw.trim() : ''
}

const allAvatars = computed(() => flattenVNodes(slots.default?.() ?? []))
const visibleAvatars = computed(() => allAvatars.value.slice(0, resolvedMax.value))
const overflowAvatars = computed(() => allAvatars.value.slice(resolvedMax.value))
const overflowCount = computed(() => Math.max(0, overflowAvatars.value.length))

const memberLabels = computed(() =>
  allAvatars.value.map(avatarLabel).filter((label) => Boolean(label))
)

const overflowMemberLabels = computed(() =>
  overflowAvatars.value.map(avatarLabel).filter((label) => Boolean(label))
)

const overflowLabel = computed(() =>
  t(LocaleKeys.avatar.overflow, { count: overflowCount.value })
)

const overflowTooltipContent = computed(() => {
  if (props.maxTooltip) return props.maxTooltip
  const labels =
    overflowMemberLabels.value.length > 0
      ? overflowMemberLabels.value
      : memberLabels.value
  if (labels.length) {
    return t(LocaleKeys.avatar.membersTooltip, {
      names: labels.join(t(LocaleKeys.avatar.listSep))
    })
  }
  return overflowLabel.value
})

const groupClass = computed(() => [
  'vp-avatar-group',
  {
    'vp-avatar-group--disabled': resolvedDisabled.value,
    'vp-avatar-group--neon': resolvedVariant.value === 'neon'
  },
  props.class
])

const groupStyle = computed(() => {
  const style: Record<string, string> = { ...(props.style || {}) }
  if (resolvedOverlap.value) {
    style['--vp-avatar-group-overlap'] = resolvedOverlap.value
  }
  return style
})

const stampedAvatars = computed(() => {
  const list = visibleAvatars.value
  const total = list.length + (overflowCount.value > 0 ? 1 : 0)
  return list.map((vnode, index) =>
    cloneVNode(vnode, {
      class: ['vp-avatar-group__item', (vnode.props?.class as string) || undefined],
      style: {
        ...((vnode.props?.style as Record<string, string>) || {}),
        zIndex: String(total - index)
      }
    })
  )
})

const overflowText = computed(() => `+${overflowCount.value}`)
const overflowTextMax = computed(() => Math.max(2, overflowText.value.length))

function handleOverflowClick(event: MouseEvent) {
  if (resolvedDisabled.value) return
  trackEmit({
    component: 'AvatarGroup',
    type: 'overflowClick',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
  emit('overflowClick', event)
}
</script>

<template>
  <div :class="groupClass" :style="groupStyle" role="group">
    <component :is="vnode" v-for="(vnode, index) in stampedAvatars" :key="index" />
    <Tooltip
      v-if="overflowCount > 0"
      :content="overflowTooltipContent"
      :disabled="resolvedDisabled"
      :delay="200"
    >
      <template v-if="slots.overflowTooltip" #content>
        <slot
          name="overflowTooltip"
          :overflow-count="overflowCount"
          :labels="overflowMemberLabels"
        />
      </template>
      <Avatar
        class="vp-avatar-group__overflow"
        :text="overflowText"
        :text-max-length="overflowTextMax"
        :alt="overflowLabel"
        :shape="resolvedShape ?? 'circle'"
        :variant="resolvedVariant"
        bordered
        clickable
        @click="handleOverflowClick"
      />
    </Tooltip>
  </div>
</template>
