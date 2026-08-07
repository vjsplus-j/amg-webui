<script setup lang="ts">
import { computed } from 'vue'
import { Ranking } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('Ranking'))

const codeBasic = demoSfc({
  imports: [
    `import { Ranking } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('Ranking')`],
  template: [`  <Ranking v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.ranking.when') }}</p>
    <DemoBlock
      :title="t('example.doc.ranking.demo.basic')"
      :description="t('example.doc.ranking.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Ranking v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
