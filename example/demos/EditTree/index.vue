<script setup lang="ts">
import { computed } from 'vue'
import { EditTree } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('EditTree'))

const codeBasic = demoSfc({
  imports: [
    `import { EditTree } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('EditTree')`],
  template: [`  <EditTree v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.editTree.when') }}</p>
    <DemoBlock
      :title="t('example.doc.editTree.demo.basic')"
      :description="t('example.doc.editTree.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <EditTree v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
