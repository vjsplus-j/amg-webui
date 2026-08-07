<script setup lang="ts">
import { computed } from 'vue'
import { PivotTable } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('PivotTable'))

const codeBasic = demoSfc({
  imports: [
    `import { PivotTable } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('PivotTable')`],
  template: [`  <PivotTable v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.pivotTable.when') }}</p>
    <DemoBlock
      :title="t('example.doc.pivotTable.demo.basic')"
      :description="t('example.doc.pivotTable.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <PivotTable v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
