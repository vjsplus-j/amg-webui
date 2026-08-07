<script setup lang="ts">
import { computed, ref } from 'vue'
import { QuickNav, Space } from '@amg-webui/core'
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
const items = computed(() => getSampleMountProps('QuickNav').items as NavItem[])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { QuickNav } from '@amg-webui/core'`
  ],
  script: [`const selected = ref('dashboard')`, `const items = [/* NavItem[] */]`],
  template: [`  <QuickNav v-model="selected" :items="items" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.quickNav.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.quickNav.when') }}</p>
    <DemoBlock
      :title="t('example.doc.quickNav.demo.basic')"
      :description="t('example.doc.quickNav.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block>
        <QuickNav v-model="selected" :items="items" :columns="3" />
        <QuickNav v-model="selected" :items="items" variant="pills" />
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
