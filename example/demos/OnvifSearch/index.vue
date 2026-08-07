<script setup lang="ts">
import { computed } from 'vue'
import { OnvifSearch } from '@amg-webui/onvif'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('OnvifSearch'))

const codeBasic = demoSfc({
  imports: [
    `import { OnvifSearch } from '@amg-webui/onvif'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('OnvifSearch')`],
  template: [`  <OnvifSearch v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.onvifSearch.when') }}</p>
    <DemoBlock
      :title="t('example.doc.onvifSearch.demo.basic')"
      :description="t('example.doc.onvifSearch.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <OnvifSearch v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
