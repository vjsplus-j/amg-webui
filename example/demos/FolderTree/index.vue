<script setup lang="ts">
import { computed } from 'vue'
import { FolderTree } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('FolderTree'))

const codeBasic = demoSfc({
  imports: [
    `import { FolderTree } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('FolderTree')`],
  template: [`  <FolderTree v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.folderTree.when') }}</p>
    <DemoBlock
      :title="t('example.doc.folderTree.demo.basic')"
      :description="t('example.doc.folderTree.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <FolderTree v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
