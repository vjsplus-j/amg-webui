<script setup lang="ts">
import { computed } from 'vue'
import { MdEditor } from '@amg-webui/editor'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('MdEditor'))

const codeBasic = demoSfc({
  imports: [
    `import { MdEditor } from '@amg-webui/editor'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('MdEditor')`],
  template: [`  <MdEditor v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.mdEditor.when') }}</p>
    <DemoBlock
      :title="t('example.doc.mdEditor.demo.basic')"
      :description="t('example.doc.mdEditor.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <MdEditor v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
