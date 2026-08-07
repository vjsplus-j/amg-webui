<script setup lang="ts">
import { computed, provide, toRef, useSlots, type Slot } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import BreadcrumbItem from '../BreadcrumbItem/index.vue'
import Icon from '@amg-webui/core/Icon/index.vue'
import { BREADCRUMB_INJECTION_KEY, type BreadcrumbItemData } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    items?: BreadcrumbItemData[]
    separator?: string
    maxCount?: number
    ariaLabel?: string
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    separator: '/',
    telemetry: undefined
  }
)

const emit = defineEmits<{
  click: [payload: { href?: string; to?: string; index: number; event: MouseEvent }]
}>()

const { t } = useLocale()
const slots = useSlots() as Readonly<{
  default?: Slot
  separator?: Slot
}>

provide(BREADCRUMB_INJECTION_KEY, {
  separator: toRef(props, 'separator'),
  separatorSlot: computed(() => slots.separator)
})

const navLabel = computed(() => props.ariaLabel ?? t('component.breadcrumb.aria'))

type VisibleRow =
  | { kind: 'item'; item: BreadcrumbItemData; index: number; current: boolean }
  | { kind: 'ellipsis' }

const visibleRows = computed<VisibleRow[]>(() => {
  const list = props.items ?? []
  if (!list.length) return []
  const max = props.maxCount
  if (!max || max < 2 || list.length <= max) {
    return list.map((item, index) => ({
      kind: 'item' as const,
      item,
      index,
      current: index === list.length - 1
    }))
  }
  const tailCount = Math.max(1, max - 2)
  const head = list[0]
  const tailStart = list.length - tailCount
  const rows: VisibleRow[] = [
    { kind: 'item', item: head, index: 0, current: false },
    { kind: 'ellipsis' }
  ]
  for (let i = tailStart; i < list.length; i++) {
    rows.push({
      kind: 'item',
      item: list[i],
      index: i,
      current: i === list.length - 1
    })
  }
  return rows
})

const useItems = computed(() => (props.items?.length ?? 0) > 0)

function onItemClick(index: number, item: BreadcrumbItemData, event: MouseEvent) {
  trackEmit({
    component: 'Breadcrumb',
    type: 'click',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { href: item.href, to: item.to, index }
  })
  emit('click', { href: item.href, to: item.to, index, event })
}
</script>

<template>
  <nav
    :class="['vp-breadcrumb', props.class]"
    :style="style"
    :aria-label="navLabel"
    data-component="Breadcrumb"
  >
    <ol class="vp-breadcrumb__list">
      <template v-if="useItems">
        <template v-for="(row, ri) in visibleRows" :key="ri">
          <BreadcrumbItem v-if="row.kind === 'ellipsis'" disabled class="vp-breadcrumb__ellipsis">
            <span :aria-label="t('component.breadcrumb.ellipsis')">
              <Icon name="Ellipsis" size="sm" />
            </span>
          </BreadcrumbItem>
          <BreadcrumbItem
            v-else
            :to="row.item.to"
            :href="row.item.href"
            :disabled="row.item.disabled"
            :current="row.current"
            :track-id="trackId"
            :telemetry="telemetry"
            @click="onItemClick(row.index, row.item, $event)"
          >
            <Icon v-if="row.item.icon" :name="row.item.icon" size="sm" class="vp-breadcrumb__icon" />
            <span>{{ row.item.label }}</span>
          </BreadcrumbItem>
        </template>
      </template>
      <slot v-else />
    </ol>
  </nav>
</template>
