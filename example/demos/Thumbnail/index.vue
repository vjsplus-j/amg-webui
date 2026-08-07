<script setup lang="ts">
import { computed } from 'vue'
import { Thumbnail } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('Thumbnail'))

const codeBasic = demoSfc({
  imports: [
    `import { Thumbnail } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('Thumbnail')`],
  template: [`  <Thumbnail v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.thumbnail.when') }}</p>
    <DemoBlock
      :title="t('example.doc.thumbnail.demo.basic')"
      :description="t('example.doc.thumbnail.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Thumbnail v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
