<script setup lang="ts">
import { computed } from 'vue'
import { TreeChart } from '@amg-webui/charts'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('TreeChart'))

const codeBasic = demoSfc({
  imports: [
    `import { TreeChart } from '@amg-webui/charts'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('TreeChart')`],
  template: [`  <TreeChart v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.treeChart.when') }}</p>
    <DemoBlock
      :title="t('example.doc.treeChart.demo.basic')"
      :description="t('example.doc.treeChart.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <TreeChart v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
