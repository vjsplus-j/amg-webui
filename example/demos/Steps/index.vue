<script setup lang="ts">
/**
 * Curated demo — Nav wave1 Steps
 */
import { ref } from 'vue'
import { Steps, StepItem, Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const active = ref(1)
const stepCount = 3

const codeInteractive = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Steps, StepItem, Button } from '@amg-webui/core'`
  ],
  script: [`const active = ref(1)`],
  template: [
    '  <Steps v-model="active" clickable>',
    `    <StepItem :title="t('example.doc.steps.sample.s1')" />`,
    `    <StepItem :title="t('example.doc.steps.sample.s2')" />`,
    `    <StepItem :title="t('example.doc.steps.sample.s3')" />`,
    '  </Steps>'
  ]
})

const codeVertical = demoCode(
  `<Steps v-model="active" direction="vertical" clickable>`,
  `  <StepItem :title="t('example.doc.steps.sample.s1')" :description="t('example.doc.steps.sample.d1')" />`,
  `  <StepItem :title="t('example.doc.steps.sample.s2')" :description="t('example.doc.steps.sample.d2')" />`,
  `  <StepItem :title="t('example.doc.steps.sample.s3')" :description="t('example.doc.steps.sample.d3')" />`,
  `</Steps>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.steps.demo.interactive')"
      :description="t('example.doc.steps.demo.interactiveDesc')"
      :code="codeInteractive"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Steps v-model="active" clickable>
          <StepItem
            :title="t('example.doc.steps.sample.s1')"
            :description="t('example.doc.steps.sample.d1')"
          />
          <StepItem
            :title="t('example.doc.steps.sample.s2')"
            :description="t('example.doc.steps.sample.d2')"
          />
          <StepItem
            :title="t('example.doc.steps.sample.s3')"
            :description="t('example.doc.steps.sample.d3')"
          />
        </Steps>
        <div class="vp-curated__row">
          <Button
            size="sm"
            variant="outlined"
            :disabled="active <= 0"
            @click="active--"
          >
            {{ t('common.previous') }}
          </Button>
          <Button
            size="sm"
            variant="solid"
            severity="primary"
            :disabled="active >= stepCount - 1"
            @click="active++"
          >
            {{ t('common.next') }}
          </Button>
        </div>
        <p class="vp-curated__hint">
          {{ t('example.doc.steps.sample.current', { step: active + 1, total: stepCount }) }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.steps.demo.vertical')"
      :description="t('example.doc.steps.demo.verticalDesc')"
      :code="codeVertical"
    >
      <Steps v-model="active" direction="vertical" clickable>
        <StepItem
          :title="t('example.doc.steps.sample.s1')"
          :description="t('example.doc.steps.sample.d1')"
        />
        <StepItem
          :title="t('example.doc.steps.sample.s2')"
          :description="t('example.doc.steps.sample.d2')"
        />
        <StepItem
          :title="t('example.doc.steps.sample.s3')"
          :description="t('example.doc.steps.sample.d3')"
        />
      </Steps>
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  gap: var(--spacing-md);
}

.vp-curated__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
