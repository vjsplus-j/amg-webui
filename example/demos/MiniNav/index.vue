<script setup lang="ts">
import { ref, computed } from 'vue'
import { MiniNav, Space } from '@amg-webui/core'
import type { NavItem } from '@amg-webui/utils/nav'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const selected = ref<string | number>('a')
const items = computed(() => getSampleMountProps('MiniNav').items as NavItem[])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { MiniNav } from '@amg-webui/core'`
  ],
  script: [`const selected = ref('home')`, `const items = [/* NavItem[] */]`],
  template: [`  <MiniNav v-model="selected" :items="items" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.miniNav.when') }}</p>
    <DemoBlock
      :title="t('example.doc.miniNav.demo.basic')"
      :description="t('example.doc.miniNav.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space align="start">
        <MiniNav v-model="selected" :items="items" />
        <MiniNav v-model="selected" :items="items" collapsed />
      </Space>
    </DemoBlock>
</div>
</template>
