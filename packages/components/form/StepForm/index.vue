<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Form from '../Form/index.vue'
import FormItem from '../FormItem/index.vue'
import InputText from '../InputText/index.vue'
import Button from '@amg-webui/core/Button/index.vue'
import Progress from '@amg-webui/core/Progress/index.vue'
import type { StepFormProps, StepFormEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<StepFormProps>(), {
  modelValue: 0,
  steps: () => [],
  stepData: () => ({}),
  loading: false
})

const emit = defineEmits<StepFormEmits>()
const { t } = useLocale()

const current = computed(() => Math.min(props.steps.length - 1, Math.max(0, props.modelValue)))
const currentStep = computed(() => props.steps[current.value])
const progress = computed(() =>
  props.steps.length <= 1 ? 100 : Math.round(((current.value + 1) / props.steps.length) * 100)
)

const stepKey = computed(() => String(currentStep.value?.name ?? current.value))
const formModel = computed(() => props.stepData?.[stepKey.value] ?? { value: '' })

const emitStep = (index: number) => {
  emit('update:modelValue', index)
  emit('change', index)
}

const updateField = (key: string, value: unknown) => {
  emit('update:stepData', {
    ...props.stepData,
    [stepKey.value]: { ...formModel.value, [key]: value }
  })
}

const prev = () => {
  if (current.value > 0) emitStep(current.value - 1)
}

const next = () => {
  if (current.value < props.steps.length - 1) emitStep(current.value + 1)
  else emit('submit', props.stepData ?? {})
}
</script>

<template>
  <div :class="['vp-step-form', props.class, { 'vp-step-form--disabled': disabled }]" :style="style" data-component="StepForm">
    <Progress class="vp-step-form__progress" :percentage="progress" :show-text="true" />
    <nav class="vp-step-form__nav" :aria-label="t(LocaleKeys.component.stepForm.navAria)">
      <button
        v-for="(step, index) in steps"
        :key="String(step.name)"
        type="button"
        :class="['vp-step-form__step', { 'vp-step-form__step--active': index === current, 'vp-step-form__step--done': index < current }]"
        :disabled="disabled"
        @click="emitStep(index)"
      >
        <span class="vp-step-form__index">{{ index + 1 }}</span>
        <span class="vp-step-form__label">{{ step.label }}</span>
      </button>
    </nav>
    <Form :model="formModel" class="vp-step-form__body" @submit.prevent="next">
      <p v-if="currentStep?.description" class="vp-step-form__desc">{{ currentStep.description }}</p>
      <FormItem v-for="(val, key) in formModel" :key="String(key)" :label="String(key)" :prop="String(key)">
        <InputText
          :model-value="String(val ?? '')"
          :disabled="disabled || loading"
          @update:model-value="(v) => updateField(String(key), v)"
        />
      </FormItem>
      <slot :step="currentStep" :index="current" />
      <div class="vp-step-form__actions">
        <Button v-if="current > 0" variant="outlined" :label="t(LocaleKeys.button.cancel)" :disabled="disabled || loading" @click="prev" />
        <Button
          :label="current < steps.length - 1 ? t(LocaleKeys.button.continue) : t(LocaleKeys.button.submit)"
          :loading="loading"
          :disabled="disabled"
          @click="next"
        />
      </div>
    </Form>
  </div>
</template>
