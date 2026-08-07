<script setup lang="ts">
import { computed, ref } from 'vue'
import { StepItem, Steps, Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const active = ref(1)

const codeBasic = demoSfc({
  imports: [`import { ref } from 'vue'`, `import { Steps, StepItem } from '@amg-webui/core'`],
  script: [`const active = ref(1)`],
  template: [
    `  <Steps v-model="active" clickable>`,
    `    <StepItem :title="t('example.doc.steps.sample.s1')" />`,
    `    <StepItem :title="t('example.doc.steps.sample.s2')" />`,
    `    <StepItem :title="t('example.doc.steps.sample.s3')" />`,
    `  </Steps>`
  ]
})

const demoTitle = computed(() => t(LocaleKeys.exampleDoc.basicMount))
const demoDesc = computed(() => t(LocaleKeys.exampleDoc.basicMountDesc))
</script>

<template>
  <div class="vp-curated">
    <DemoBlock :title="demoTitle" :description="demoDesc" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Steps v-model="active" clickable>
          <StepItem :title="t('example.doc.steps.sample.s1')" />
          <StepItem :title="t('example.doc.steps.sample.s2')" />
          <StepItem :title="t('example.doc.steps.sample.s3')" />
        </Steps>
        <Space wrap>
          <Button
            size="sm"
            variant="outlined"
            :disabled="active <= 0"
            :label="t('common.previous')"
            @click="active = Math.max(0, active - 1)"
          />
          <Button
            size="sm"
            :disabled="active >= 2"
            :label="t('common.next')"
            @click="active = Math.min(2, active + 1)"
          />
        </Space>
      </Space>
    </DemoBlock>
  </div>
</template>
