<script setup lang="ts">
import { computed } from 'vue'
import { OnvifGroupTree } from '@amg-webui/onvif'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('OnvifGroupTree'))

const codeBasic = demoSfc({
  imports: [
    `import { OnvifGroupTree } from '@amg-webui/onvif'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('OnvifGroupTree')`],
  template: [`  <OnvifGroupTree v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.onvifGroupTree.when') }}</p>
    <DemoBlock
      :title="t('example.doc.onvifGroupTree.demo.basic')"
      :description="t('example.doc.onvifGroupTree.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <OnvifGroupTree v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
