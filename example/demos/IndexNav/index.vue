<script setup lang="ts">
import { ref, computed } from 'vue'
import { IndexNav } from '@amg-webui/core'
import type { NavItem } from '@amg-webui/utils/nav'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const selected = ref<string | number>('a')
const items = computed(() => getSampleMountProps('IndexNav').items as NavItem[])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { IndexNav } from '@amg-webui/core'`
  ],
  script: [`const selected = ref('a')`, `const items = [/* NavItem[] */]`],
  template: [`  <IndexNav v-model="selected" :items="items" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.indexNav.when') }}</p>
    <DemoBlock
      :title="t('example.doc.indexNav.demo.basic')"
      :description="t('example.doc.indexNav.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <IndexNav v-model="selected" :items="items" />
    </DemoBlock>
</div>
</template>
