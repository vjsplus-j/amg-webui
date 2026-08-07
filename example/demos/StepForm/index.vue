<script setup lang="ts">
/**
 * Curated demo — Form wave2 StepForm
 */
import { computed, ref } from 'vue'
import { StepForm } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { ToastService } from '@amg-webui/theme'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const step = ref(0)
const stepData = ref<Record<string, Record<string, unknown>>>({
  '0': { name: 'Alex Chen' },
  '1': { email: 'alex@example.com' },
  '2': { plan: 'pro' }
})

const steps = computed(() => [
  {
    name: 0,
    label: t('example.doc.stepForm.sample.stepProfile'),
    description: t('example.doc.stepForm.sample.stepProfileDesc')
  },
  {
    name: 1,
    label: t('example.doc.stepForm.sample.stepContact'),
    description: t('example.doc.stepForm.sample.stepContactDesc')
  },
  {
    name: 2,
    label: t('example.doc.stepForm.sample.stepConfirm'),
    description: t('example.doc.stepForm.sample.stepConfirmDesc')
  }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { StepForm } from '@amg-webui/form'`
  ],
  script: [
    `const step = ref(0)`,
    `const stepData = ref({ '0': { name: '' }, '1': { email: '' }, '2': { plan: '' } })`,
    `const steps = computed(() => [/* … */])`
  ],
  template: [
    `  <StepForm`,
    `    v-model="step"`,
    `    v-model:step-data="stepData"`,
    `    :steps="steps"`,
    `    @submit="onSubmit"`,
    `  />`
  ]
})

const codeDisabled = demoCode(
  `<StepForm`,
  `  v-model="step"`,
  `  v-model:step-data="stepData"`,
  `  :steps="steps"`,
  `  disabled`,
  `/>`
)

function onSubmit(data: Record<string, Record<string, unknown>>) {
  ToastService.success({
    summary: t('example.doc.stepForm.sample.submitted'),
    detail: JSON.stringify(data)
  })
}

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.stepForm.prop.modelValue'),
    type: 'number',
    defaultValue: '0'
  },
  {
    name: 'steps',
    description: t('example.doc.stepForm.prop.steps'),
    type: 'StepFormStep[]',
    defaultValue: '[]'
  },
  {
    name: 'stepData',
    description: t('example.doc.stepForm.prop.stepData'),
    type: 'Record<string, Record<string, unknown>>',
    defaultValue: '{}'
  },
  {
    name: 'disabled / loading',
    description: t('example.doc.stepForm.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.stepForm.event.change'),
    type: '(step: number) => void',
    defaultValue: '-'
  },
  {
    name: 'submit',
    description: t('example.doc.stepForm.event.submit'),
    type: '(data: Record<string, Record<string, unknown>>) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.stepForm.demo.basic')"
      :description="t('example.doc.stepForm.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <StepForm
        v-model="step"
        v-model:step-data="stepData"
        :steps="steps"
        @submit="onSubmit"
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.stepForm.demo.disabled')"
      :description="t('example.doc.stepForm.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <StepForm
        v-model="step"
        v-model:step-data="stepData"
        :steps="steps"
        disabled
      />
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-secondary);
}
</style>
