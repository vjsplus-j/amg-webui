<script setup lang="ts">
import { computed } from 'vue'
import { CardList } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('CardList'))

const codeBasic = demoSfc({
  imports: [
    `import { CardList } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('CardList')`],
  template: [`  <CardList v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.cardList.when') }}</p>
    <DemoBlock
      :title="t('example.doc.cardList.demo.basic')"
      :description="t('example.doc.cardList.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <CardList v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
