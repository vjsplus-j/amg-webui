<script setup lang="ts">
import { computed } from 'vue'
import { SplitVideoWall } from '@amg-webui/media'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('SplitVideoWall'))

const codeBasic = demoSfc({
  imports: [
    `import { SplitVideoWall } from '@amg-webui/media'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('SplitVideoWall')`],
  template: [`  <SplitVideoWall v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.splitVideoWall.when') }}</p>
    <DemoBlock
      :title="t('example.doc.splitVideoWall.demo.basic')"
      :description="t('example.doc.splitVideoWall.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <SplitVideoWall v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
