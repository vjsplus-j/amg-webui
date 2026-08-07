<script setup lang="ts">
import { computed } from 'vue'
import { StatusTip } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('StatusTip'))

const codeBasic = demoSfc({
  imports: [
    `import { StatusTip } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('StatusTip')`],
  template: [`  <StatusTip v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.statusTip.when') }}</p>
    <DemoBlock
      :title="t('example.doc.statusTip.demo.basic')"
      :description="t('example.doc.statusTip.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <StatusTip v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
