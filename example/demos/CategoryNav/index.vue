<script setup lang="ts">
import { ref, computed } from 'vue'
import { CategoryNav, Space } from '@amg-webui/core'
import type { NavItem } from '@amg-webui/utils/nav'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const selected = ref<string | number>('a')
const items = computed(() => getSampleMountProps('CategoryNav').items as NavItem[])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { CategoryNav } from '@amg-webui/core'`
  ],
  script: [
    `const selected = ref('overview')`,
    `const items = [/* NavItem[] */]`
  ],
  template: [`  <CategoryNav v-model="selected" :items="items" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.categoryNav.when') }}</p>
    <DemoBlock
      :title="t('example.doc.categoryNav.demo.basic')"
      :description="t('example.doc.categoryNav.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block>
        <CategoryNav v-model="selected" :items="items" />
        <CategoryNav v-model="selected" :items="items" variant="cards" />
      </Space>
    </DemoBlock>
</div>
</template>
