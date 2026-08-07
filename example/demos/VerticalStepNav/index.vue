<script setup lang="ts">
import { computed, ref } from 'vue'
import { VerticalStepNav } from '@amg-webui/core'
import type { VerticalStepNavItem } from '@amg-webui/core/VerticalStepNav/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const selected = ref<string | number>(0)
const items = computed(
  () => getSampleMountProps('VerticalStepNav').items as VerticalStepNavItem[]
)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { VerticalStepNav } from '@amg-webui/core'`
  ],
  script: [`const selected = ref(0)`, `const items = [/* VerticalStepNavItem[] */]`],
  template: [`  <VerticalStepNav v-model="selected" :items="items" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.verticalStepNav.when') }}</p>
    <DemoBlock
      :title="t('example.doc.verticalStepNav.demo.basic')"
      :description="t('example.doc.verticalStepNav.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <VerticalStepNav v-model="selected" :items="items" />
    </DemoBlock>
</div>
</template>
