<script setup lang="ts">
import { ref, computed } from 'vue'
import { FooterNav } from '@amg-webui/core'
import type { NavItem } from '@amg-webui/utils/nav'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const selected = ref<string | number>('a')
const items = computed(() => getSampleMountProps('FooterNav').items as NavItem[])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { FooterNav } from '@amg-webui/core'`
  ],
  script: [`const selected = ref('docs')`, `const items = [/* NavItem[] */]`],
  template: [`  <FooterNav v-model="selected" :items="items" dividers />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.footerNav.when') }}</p>
    <DemoBlock
      :title="t('example.doc.footerNav.demo.basic')"
      :description="t('example.doc.footerNav.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <FooterNav v-model="selected" :items="items" dividers />
    </DemoBlock>
</div>
</template>
