<script setup lang="ts">
import { computed } from 'vue'
import { WordCloud } from '@amg-webui/charts'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('WordCloud'))

const codeBasic = demoSfc({
  imports: [
    `import { WordCloud } from '@amg-webui/charts'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('WordCloud')`],
  template: [`  <WordCloud v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.wordCloud.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.wordCloud.when') }}</p>
    <DemoBlock
      :title="t('example.doc.wordCloud.demo.basic')"
      :description="t('example.doc.wordCloud.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <WordCloud v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
