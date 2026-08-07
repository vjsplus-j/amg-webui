<script setup lang="ts">
import { computed, useSlots, type Slot } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import Button from '@amg-webui/core/Button/index.vue'
import Empty from '@amg-webui/core/Empty/index.vue'
import LoadingTip from '@amg-webui/core/LoadingTip/index.vue'
import type { DashboardProps, DashboardEmits, DashboardStat } from './types'
import './style.scss'

const props = withDefaults(defineProps<DashboardProps>(), {
  stats: () => [],
  widgets: () => [],
  columns: 3,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<DashboardEmits>()
const { t } = useLocale()
const slots: Readonly<Record<string, Slot | undefined>> = useSlots()

const gridStyle = computed(() => ({
  '--vp-dashboard-columns': String(Math.max(1, props.columns ?? 3))
}))

const widgetItems = computed(() => {
  if (props.widgets.length) return props.widgets
  return props.stats.map((stat) => ({ id: stat.id, label: stat.label, span: 1 }))
})

const statMap = computed(() => Object.fromEntries(props.stats.map((s) => [s.id, s])))

const hasWidgetSlot = (id: string): boolean => Boolean(slots[`widget-${id}`])
const hasContent = computed<boolean>(
  () => props.stats.length > 0 || props.widgets.some((w) => hasWidgetSlot(w.id))
)

function track(type: string, payload?: Record<string, unknown>) {
  trackEmit({
    component: 'Dashboard',
    type,
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload
  })
}

const onRefresh = () => {
  track('refresh')
  emit('refresh')
}

const onSelect = (stat: DashboardStat) => {
  track('select-stat', { statId: stat.id })
  emit('select-stat', stat)
}
</script>

<template>
  <div
    :class="['vp-dashboard', props.class, { 'vp-dashboard--loading': loading }]"
    :style="{ ...gridStyle, ...style }"
    data-component="Dashboard"
  >
    <header class="vp-dashboard__header">
      <slot name="title">
        <h2 class="vp-dashboard__title">{{ t(LocaleKeys.page.dashboardTitle) }}</h2>
      </slot>
      <div class="vp-dashboard__actions">
        <slot name="extra" />
        <Button
          variant="outlined"
          size="sm"
          :label="loading ? t(LocaleKeys.common.loading) : t(LocaleKeys.button.refresh)"
          :loading="loading"
          @click="onRefresh"
        />
      </div>
    </header>

    <LoadingTip v-if="loading && !hasContent" block :message="t(LocaleKeys.common.loading)" />

    <Empty v-else-if="!hasContent" :description="t('component.dashboard.empty')">
      <template v-if="$slots.empty" #default>
        <slot name="empty" />
      </template>
    </Empty>

    <div v-else class="vp-dashboard__grid">
      <div
        v-for="widget in widgetItems"
        :key="widget.id"
        class="vp-dashboard__cell"
        :style="{ gridColumn: `span ${widget.span ?? 1}` }"
      >
        <slot :name="`widget-${widget.id}`" :widget="widget" :stat="statMap[widget.id]">
          <button
            v-if="statMap[widget.id]"
            type="button"
            class="vp-dashboard__card"
            @click="onSelect(statMap[widget.id])"
          >
            <span class="vp-dashboard__label">{{ statMap[widget.id].label }}</span>
            <strong class="vp-dashboard__value">{{ statMap[widget.id].value }}</strong>
            <span
              v-if="statMap[widget.id].trend"
              :class="['vp-dashboard__trend', `vp-dashboard__trend--${statMap[widget.id].trend}`]"
            >
              {{ statMap[widget.id].trend === 'up' ? '+' : statMap[widget.id].trend === 'down' ? '-' : '=' }}
            </span>
          </button>
        </slot>
      </div>
    </div>

    <slot />
  </div>
</template>
