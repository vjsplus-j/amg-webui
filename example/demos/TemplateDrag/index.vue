<script setup lang="ts">
import { computed } from 'vue'
import { TemplateDrag } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('TemplateDrag'))

const codeBasic = demoSfc({
  imports: [
    `import { TemplateDrag } from '@amg-webui/components/base'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('TemplateDrag')`],
  template: [`  <TemplateDrag v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.templateDrag.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.templateDrag.when') }}</p>
    <DemoBlock
      :title="t('example.doc.templateDrag.demo.basic')"
      :description="t('example.doc.templateDrag.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <TemplateDrag v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
