<script setup lang="ts">
import { computed } from 'vue'
import { OnvifRecordPlan } from '@amg-webui/onvif'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('OnvifRecordPlan'))

const codeBasic = demoSfc({
  imports: [
    `import { OnvifRecordPlan } from '@amg-webui/onvif'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('OnvifRecordPlan')`],
  template: [`  <OnvifRecordPlan v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.onvifRecordPlan.when') }}</p>
    <DemoBlock
      :title="t('example.doc.onvifRecordPlan.demo.basic')"
      :description="t('example.doc.onvifRecordPlan.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <OnvifRecordPlan v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
