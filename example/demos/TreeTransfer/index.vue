<script setup lang="ts">
import { computed } from 'vue'
import { TreeTransfer } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('TreeTransfer'))

const codeBasic = demoSfc({
  imports: [
    `import { TreeTransfer } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('TreeTransfer')`],
  template: [`  <TreeTransfer v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.treeTransfer.when') }}</p>
    <DemoBlock
      :title="t('example.doc.treeTransfer.demo.basic')"
      :description="t('example.doc.treeTransfer.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <TreeTransfer v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
