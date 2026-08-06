<script setup lang="ts">
import { computed, ref } from 'vue'
import { MiniNav, Space } from '@amg-webui/components/base'
import type { NavItem } from '@amg-webui/utils/nav'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const selected = ref<string | number>('a')
const items = computed(() => getSampleMountProps('MiniNav').items as NavItem[])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { MiniNav } from '@amg-webui/components/base'`
  ],
  script: [`const selected = ref('home')`, `const items = [/* NavItem[] */]`],
  template: [`  <MiniNav v-model="selected" :items="items" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.miniNav.prop.base')
  }
])
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
    <PropsTable :rows="propRows" />
  </div>
</template>
