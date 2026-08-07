<script setup lang="ts">
import { computed } from 'vue'
import { TransferTree } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('TransferTree'))

const codeBasic = demoSfc({
  imports: [
    `import { TransferTree } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('TransferTree')`],
  template: [`  <TransferTree v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.transferTree.when') }}</p>
    <DemoBlock
      :title="t('example.doc.transferTree.demo.basic')"
      :description="t('example.doc.transferTree.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <TransferTree v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
