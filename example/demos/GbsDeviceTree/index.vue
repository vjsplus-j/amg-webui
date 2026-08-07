<script setup lang="ts">
import { computed } from 'vue'
import { GbsDeviceTree } from '@amg-webui/gb28181'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('GbsDeviceTree'))

const codeBasic = demoSfc({
  imports: [
    `import { GbsDeviceTree } from '@amg-webui/gb28181'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('GbsDeviceTree')`],
  template: [`  <GbsDeviceTree v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.gbsDeviceTree.when') }}</p>
    <DemoBlock
      :title="t('example.doc.gbsDeviceTree.demo.basic')"
      :description="t('example.doc.gbsDeviceTree.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <GbsDeviceTree v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
