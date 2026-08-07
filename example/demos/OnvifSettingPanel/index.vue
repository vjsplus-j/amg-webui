<script setup lang="ts">
import { computed } from 'vue'
import { OnvifSettingPanel } from '@amg-webui/onvif'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('OnvifSettingPanel'))

const codeBasic = demoSfc({
  imports: [
    `import { OnvifSettingPanel } from '@amg-webui/onvif'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('OnvifSettingPanel')`],
  template: [`  <OnvifSettingPanel v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.onvifSettingPanel.when') }}</p>
    <DemoBlock
      :title="t('example.doc.onvifSettingPanel.demo.basic')"
      :description="t('example.doc.onvifSettingPanel.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <OnvifSettingPanel v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
