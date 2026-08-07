<script setup lang="ts">
import { computed } from 'vue'
import { StickyTable } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('StickyTable'))

const codeBasic = demoSfc({
  imports: [
    `import { StickyTable } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('StickyTable')`],
  template: [`  <StickyTable v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.stickyTable.when') }}</p>
    <DemoBlock
      :title="t('example.doc.stickyTable.demo.basic')"
      :description="t('example.doc.stickyTable.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <StickyTable v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
