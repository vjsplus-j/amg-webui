<script setup lang="ts">
import { computed } from 'vue'
import { CardNav } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('CardNav'))

const codeBasic = demoSfc({
  imports: [
    `import { CardNav } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('CardNav')`],
  template: [`  <CardNav v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.cardNav.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.cardNav.when') }}</p>
    <DemoBlock
      :title="t('example.doc.cardNav.demo.basic')"
      :description="t('example.doc.cardNav.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <CardNav v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
