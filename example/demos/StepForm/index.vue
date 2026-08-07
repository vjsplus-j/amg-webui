<script setup lang="ts">
/**
 * Curated demo — Form wave2 StepForm
 */
import { ref, computed } from 'vue'
import { StepForm } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { ToastService } from '@amg-webui/theme'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
  </div>
</template>

<style scoped lang="scss">
.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
