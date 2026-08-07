<script setup lang="ts">
import { computed } from 'vue'
import { ExcelIo } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('ExcelIo'))

const codeBasic = demoSfc({
  imports: [
    `import { ExcelIo } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('ExcelIo')`],
  template: [`  <ExcelIo v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.excelIo.when') }}</p>
    <DemoBlock
      :title="t('example.doc.excelIo.demo.basic')"
      :description="t('example.doc.excelIo.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <ExcelIo v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
