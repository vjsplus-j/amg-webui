<script setup lang="ts">
import { computed } from 'vue'
import { GbsTimeSync } from '@amg-webui/gb28181'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('GbsTimeSync'))

const codeBasic = demoSfc({
  imports: [
    `import { GbsTimeSync } from '@amg-webui/gb28181'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('GbsTimeSync')`],
  template: [`  <GbsTimeSync v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.gbsTimeSync.when') }}</p>
    <DemoBlock
      :title="t('example.doc.gbsTimeSync.demo.basic')"
      :description="t('example.doc.gbsTimeSync.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <GbsTimeSync v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
