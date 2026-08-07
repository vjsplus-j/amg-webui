<script setup lang="ts">
import { computed } from 'vue'
import { CryptoBox } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('CryptoBox'))

const codeBasic = demoSfc({
  imports: [
    `import { CryptoBox } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('CryptoBox')`],
  template: [`  <CryptoBox v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.cryptoBox.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.cryptoBox.when') }}</p>
    <DemoBlock
      :title="t('example.doc.cryptoBox.demo.basic')"
      :description="t('example.doc.cryptoBox.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <CryptoBox v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
