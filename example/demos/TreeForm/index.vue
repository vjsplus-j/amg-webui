<script setup lang="ts">
import { computed } from 'vue'
import { TreeForm } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('TreeForm'))

const codeBasic = demoSfc({
  imports: [
    `import { TreeForm } from '@amg-webui/form'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('TreeForm')`],
  template: [`  <TreeForm v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.treeForm.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.treeForm.when') }}</p>
    <DemoBlock
      :title="t('example.doc.treeForm.demo.basic')"
      :description="t('example.doc.treeForm.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <TreeForm v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
