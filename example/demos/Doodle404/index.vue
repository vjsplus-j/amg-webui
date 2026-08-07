<script setup lang="ts">
import { computed } from 'vue'
import { Doodle404 } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('Doodle404'))

const codeBasic = demoSfc({
  imports: [
    `import { Doodle404 } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('Doodle404')`],
  template: [`  <Doodle404 v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.doodle404.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.doodle404.when') }}</p>
    <DemoBlock
      :title="t('example.doc.doodle404.demo.basic')"
      :description="t('example.doc.doodle404.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Doodle404 v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
