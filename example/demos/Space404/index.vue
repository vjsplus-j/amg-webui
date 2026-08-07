<script setup lang="ts">
import { computed } from 'vue'
import { Space404 } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('Space404'))

const codeBasic = demoSfc({
  imports: [
    `import { Space404 } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('Space404')`],
  template: [`  <Space404 v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.space404.when') }}</p>
    <DemoBlock
      :title="t('example.doc.space404.demo.basic')"
      :description="t('example.doc.space404.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space404 v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
