<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Button from '../Button/index.vue'
import type { DashboardProps, DashboardEmits, DashboardStat } from './types'
import './style.scss'

const props = withDefaults(defineProps<DashboardProps>(), {
  stats: () => [],
  loading: false
})

const emit = defineEmits<DashboardEmits>()
const { t } = useLocale()

const onSelect = (stat: DashboardStat) => emit('select-stat', stat)
</script>

<template>
  <div :class="['vp-dashboard', props.class]" :style="style" data-component="Dashboard">
    <header class="vp-dashboard__header">
      <h2 class="vp-dashboard__title">{{ t(LocaleKeys.page.dashboardTitle) }}</h2>
      <Button
        variant="outlined"
        size="sm"
        :label="loading ? t(LocaleKeys.common.loading) : t(LocaleKeys.button.refresh)"
        :loading="loading"
        @click="emit('refresh')"
      />
    </header>
    <div class="vp-dashboard__grid">
      <button
        v-for="stat in stats"
        :key="stat.id"
        type="button"
        class="vp-dashboard__card"
        @click="onSelect(stat)"
      >
        <span class="vp-dashboard__label">{{ stat.label }}</span>
        <strong class="vp-dashboard__value">{{ stat.value }}</strong>
        <span v-if="stat.trend" :class="['vp-dashboard__trend', `vp-dashboard__trend--${stat.trend}`]">
          {{ stat.trend === 'up' ? '+' : stat.trend === 'down' ? '-' : '=' }}
        </span>
      </button>
    </div>
    <slot />
  </div>
</template>
