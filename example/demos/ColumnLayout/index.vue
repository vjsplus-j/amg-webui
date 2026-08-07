<script setup lang="ts">
import { computed } from 'vue'
import { ColumnLayout } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('ColumnLayout'))

const codeBasic = demoSfc({
  imports: [
    `import { ColumnLayout } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('ColumnLayout')`],
  template: [`  <ColumnLayout v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.columnLayout.when') }}</p>
    <DemoBlock
      :title="t('example.doc.columnLayout.demo.basic')"
      :description="t('example.doc.columnLayout.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <ColumnLayout v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
