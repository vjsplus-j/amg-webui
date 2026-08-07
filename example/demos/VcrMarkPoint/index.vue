<script setup lang="ts">
import { computed } from 'vue'
import { VcrMarkPoint } from '@amg-webui/media'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('VcrMarkPoint'))

const codeBasic = demoSfc({
  imports: [
    `import { VcrMarkPoint } from '@amg-webui/media'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('VcrMarkPoint')`],
  template: [`  <VcrMarkPoint v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.vcrMarkPoint.when') }}</p>
    <DemoBlock
      :title="t('example.doc.vcrMarkPoint.demo.basic')"
      :description="t('example.doc.vcrMarkPoint.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <VcrMarkPoint v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
