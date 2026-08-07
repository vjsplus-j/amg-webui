<script setup lang="ts">
import { computed } from 'vue'
import { DrillTable } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('DrillTable'))

const codeBasic = demoSfc({
  imports: [
    `import { DrillTable } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('DrillTable')`],
  template: [`  <DrillTable v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.drillTable.when') }}</p>
    <DemoBlock
      :title="t('example.doc.drillTable.demo.basic')"
      :description="t('example.doc.drillTable.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <DrillTable v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
