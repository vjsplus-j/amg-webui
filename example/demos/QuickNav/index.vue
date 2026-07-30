<script setup lang="ts">
import { computed } from 'vue'
import { QuickNav } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('QuickNav'))

const codeBasic = demoSfc({
  imports: [
    `import { QuickNav } from '@amg-webui/components/base'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('QuickNav')`],
  template: [`  <QuickNav v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.quickNav.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.quickNav.when') }}</p>
    <DemoBlock
      :title="t('example.doc.quickNav.demo.basic')"
      :description="t('example.doc.quickNav.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <QuickNav v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
