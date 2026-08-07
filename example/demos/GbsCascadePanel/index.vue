<script setup lang="ts">
import { computed } from 'vue'
import { GbsCascadePanel } from '@amg-webui/gb28181'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('GbsCascadePanel'))

const codeBasic = demoSfc({
  imports: [
    `import { GbsCascadePanel } from '@amg-webui/gb28181'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('GbsCascadePanel')`],
  template: [`  <GbsCascadePanel v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.gbsCascadePanel.when') }}</p>
    <DemoBlock
      :title="t('example.doc.gbsCascadePanel.demo.basic')"
      :description="t('example.doc.gbsCascadePanel.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <GbsCascadePanel v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
