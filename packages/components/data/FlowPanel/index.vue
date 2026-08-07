<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import Tag from '@amg-webui/core/Tag/index.vue'
import Button from '@amg-webui/core/Button/index.vue'
import Steps from '@amg-webui/core/Steps/index.vue'
import StepItem from '@amg-webui/core/StepItem/index.vue'
import type { FlowPanelProps, FlowPanelEmits, FlowStep } from './types'
import './style.scss'

const props = withDefaults(defineProps<FlowPanelProps>(), {
  steps: () => [],
  current: '',
  showNav: false,
  blockOnError: true,
  telemetry: undefined
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
  if (status === 'done') return t('component.flow-panel.status.done')
  if (status === 'active') return t('component.flow-panel.status.active')
  if (status === 'error') return t('component.flow-panel.status.error')
  return t('component.flow-panel.status.pending')
}

const activeId = computed(
  () => props.current || props.steps.find((s) => s.status === 'active')?.id || props.steps[0]?.id
)

const activeIndex = computed(() => props.steps.findIndex((s) => s.id === activeId.value))

const activeStep = computed(() => props.steps[activeIndex.value] ?? null)

const stepsActive = computed(() => Math.max(0, activeIndex.value))

const canPrev = computed(() => activeIndex.value > 0)
const canNext = computed(() => {
  if (activeIndex.value < 0 || activeIndex.value >= props.steps.length - 1) return false
  if (props.blockOnError && activeStep.value?.status === 'error') return false
  return true
})

function track(type: string, payload?: Record<string, unknown>) {
  trackEmit({
    component: 'FlowPanel',
    type,
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload
  })
}

const setCurrent = (step: FlowStep) => {
  emit('update:current', step.id)
  track('select', { stepId: step.id })
  emit('select', step)
}

const onSelect = (step: FlowStep) => setCurrent(step)

const onStepsChange = (index: number) => {
  const step = props.steps[index]
  if (step) setCurrent(step)
}

const onPrev = () => {
  if (!canPrev.value) return
  const step = props.steps[activeIndex.value - 1] ?? null
  if (step) emit('update:current', step.id)
  track('prev', { stepId: step?.id })
  emit('prev', step)
}

const onNext = () => {
  if (!canNext.value) return
  const step = props.steps[activeIndex.value + 1] ?? null
  if (step) emit('update:current', step.id)
  track('next', { stepId: step?.id })
  emit('next', step)
}
</script>

<template>
  <div :class="['vp-flow-panel', props.class]" :style="style" data-component="FlowPanel">
    <Steps
      v-if="steps.length"
      class="vp-flow-panel__steps"
      :active="stepsActive"
      clickable
      @change="onStepsChange"
    >
      <StepItem
        v-for="step in steps"
        :key="step.id"
        :title="step.title"
        :description="step.description"
      />
    </Steps>

    <ol class="vp-flow-panel__timeline" :aria-label="t('component.flow-panel.title')">
      <li
        v-for="(step, index) in steps"
        :key="step.id"
        :class="[
          'vp-flow-panel__item',
          `vp-flow-panel__item--${step.status}`,
          { 'vp-flow-panel__item--current': step.id === activeId }
        ]"
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
    </ol>

    <div v-if="$slots.default" class="vp-flow-panel__body">
      <slot :step="activeStep" :index="activeIndex" />
    </div>

    <footer v-if="showNav || $slots.footer" class="vp-flow-panel__footer">
      <slot name="footer" :step="activeStep" :index="activeIndex">
        <div v-if="showNav" class="vp-flow-panel__nav">
          <Button
            variant="outlined"
            :label="t(LocaleKeys.common.previous)"
            :disabled="!canPrev"
            @click="onPrev"
          />
          <Button
            variant="solid"
            severity="primary"
            :label="t(LocaleKeys.common.next)"
            :disabled="!canNext"
            @click="onNext"
          />
        </div>
      </slot>
    </footer>

    <slot />
  </div>
</template>
