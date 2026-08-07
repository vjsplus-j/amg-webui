<script setup lang="ts">
import { computed } from 'vue'
import { ScrollNotice } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('ScrollNotice'))

const codeBasic = demoSfc({
  imports: [
    `import { ScrollNotice } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('ScrollNotice')`],
  template: [`  <ScrollNotice v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.scrollNotice.when') }}</p>
    <DemoBlock
      :title="t('example.doc.scrollNotice.demo.basic')"
      :description="t('example.doc.scrollNotice.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <ScrollNotice v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
