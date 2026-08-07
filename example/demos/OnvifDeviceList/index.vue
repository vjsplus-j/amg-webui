<script setup lang="ts">
import { computed } from 'vue'
import { OnvifDeviceList } from '@amg-webui/onvif'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('OnvifDeviceList'))

const codeBasic = demoSfc({
  imports: [
    `import { OnvifDeviceList } from '@amg-webui/onvif'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('OnvifDeviceList')`],
  template: [`  <OnvifDeviceList v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.onvifDeviceList.when') }}</p>
    <DemoBlock
      :title="t('example.doc.onvifDeviceList.demo.basic')"
      :description="t('example.doc.onvifDeviceList.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <OnvifDeviceList v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
