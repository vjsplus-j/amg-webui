<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsStatusCardProps, GbsStatusCardEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<GbsStatusCardProps>(), { registered: true, deviceCount: 12, channelCount: 48, disabled: false })
const emit = defineEmits<GbsStatusCardEmits>()
const { t } = useLocale()
const sipLabel = computed(() => props.registered ? t('industry.gbs.registered') : t('industry.gbs.unregistered'))
</script>
<template>
  <div :class="['vp-gbs-status-card', 'vp-gbs-status-card__panel', props.class]" :style="style" data-component="GbsStatusCard">
    <div class="vp-gbs-status-card__toolbar">
      <h3 class="vp-gbs-status-card__title">{{ t('industry.gbs.status') }}</h3>
      <button type="button" class="vp-gbs-status-card__btn vp-gbs-status-card__btn--ghost" :disabled="disabled" @click="emit('refresh')">{{ t('button.refresh') }}</button>
    </div>
    <div class="vp-gbs-status-card__stats">
      <div class="vp-gbs-status-card__stat">
        <span class="vp-gbs-status-card__label">{{ t('industry.gbs.sipStatus') }}</span>
        <span class="vp-gbs-status-card__stat-value">
          <span :class="['vp-gbs-status-card__badge', registered ? 'vp-gbs-status-card__badge--on' : 'vp-gbs-status-card__badge--off']">{{ sipLabel }}</span>
        </span>
      </div>
      <div class="vp-gbs-status-card__stat">
        <span class="vp-gbs-status-card__label">{{ t('industry.gbs.deviceCount') }}</span>
        <span class="vp-gbs-status-card__stat-value">{{ deviceCount }}</span>
      </div>
      <div class="vp-gbs-status-card__stat">
        <span class="vp-gbs-status-card__label">{{ t('industry.gbs.channelCount') }}</span>
        <span class="vp-gbs-status-card__stat-value">{{ channelCount }}</span>
      </div>
    </div>
  </div>
</template>