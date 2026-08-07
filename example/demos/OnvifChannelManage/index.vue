<script setup lang="ts">
import { computed } from 'vue'
import { OnvifChannelManage } from '@amg-webui/onvif'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('OnvifChannelManage'))

const codeBasic = demoSfc({
  imports: [
    `import { OnvifChannelManage } from '@amg-webui/onvif'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('OnvifChannelManage')`],
  template: [`  <OnvifChannelManage v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.onvifChannelManage.when') }}</p>
    <DemoBlock
      :title="t('example.doc.onvifChannelManage.demo.basic')"
      :description="t('example.doc.onvifChannelManage.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <OnvifChannelManage v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
