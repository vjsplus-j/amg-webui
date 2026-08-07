<script setup lang="ts">
import { computed } from 'vue'
import { DataCard } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('DataCard'))

const codeBasic = demoSfc({
  imports: [
    `import { DataCard } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('DataCard')`],
  template: [`  <DataCard v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.dataCard.when') }}</p>
    <DemoBlock
      :title="t('example.doc.dataCard.demo.basic')"
      :description="t('example.doc.dataCard.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <DataCard v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
