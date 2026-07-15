<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Tag from '../Tag/index.vue'
import type { FlowPanelProps, FlowPanelEmits, FlowStep } from './types'
import './style.scss'

const props = withDefaults(defineProps<FlowPanelProps>(), {
  steps: () => [],
  current: ''
})

const emit = defineEmits<FlowPanelEmits>()
const { t } = useLocale()

const severityMap = {
  pending: 'secondary',
  active: 'primary',
  done: 'success',
  error: 'danger'
} as const

const statusLabel = (status: FlowStep['status']) => {
  if (status === 'done') return t(LocaleKeys.common.success)
  if (status === 'active') return t(LocaleKeys.common.actions)
  if (status === 'error') return t(LocaleKeys.error.generic)
  return t(LocaleKeys.common.loading)
}

const activeId = computed(() => props.current || props.steps.find((s) => s.status === 'active')?.id)

const onSelect = (step: FlowStep) => emit('select', step)
</script>

<template>
  <ol :class="['vp-flow-panel', props.class]" :style="style" data-component="FlowPanel">
    <li
      v-for="(step, index) in steps"
      :key="step.id"
      :class="['vp-flow-panel__item', `vp-flow-panel__item--${step.status}`, { 'vp-flow-panel__item--current': step.id === activeId }]"
    >
      <button type="button" class="vp-flow-panel__btn" @click="onSelect(step)">
        <span class="vp-flow-panel__index">{{ index + 1 }}</span>
        <div class="vp-flow-panel__content">
          <div class="vp-flow-panel__head">
            <strong>{{ step.title }}</strong>
            <Tag :label="statusLabel(step.status)" :severity="severityMap[step.status]" size="sm" />
          </div>
          <p v-if="step.description" class="vp-flow-panel__desc">{{ step.description }}</p>
          <time v-if="step.time" class="vp-flow-panel__time">{{ step.time }}</time>
        </div>
      </button>
    </li>
    <slot />
  </ol>
</template>
