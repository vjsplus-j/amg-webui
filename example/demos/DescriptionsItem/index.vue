<script setup lang="ts">
import { computed } from 'vue'
import { DescriptionsItem } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('DescriptionsItem'))

const codeBasic = demoSfc({
  imports: [
    `import { DescriptionsItem } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('DescriptionsItem')`],
  template: [`  <DescriptionsItem v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.descriptionsItem.when') }}</p>
    <DemoBlock
      :title="t('example.doc.descriptionsItem.demo.basic')"
      :description="t('example.doc.descriptionsItem.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <DescriptionsItem v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
