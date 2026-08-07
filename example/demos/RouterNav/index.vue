<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterNav, Space } from '@amg-webui/core'
import type { NavItem } from '@amg-webui/utils/nav'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const route = useRoute()

const items = computed<NavItem[]>(() => [
  { label: t('example.doc.routerNav.sample.layout'), value: 'layout', to: '/base/layout' },
  { label: t('example.doc.routerNav.sample.tabsNav'), value: 'tabsNav', to: '/base/TabsNav' },
  { label: t('example.doc.routerNav.sample.anchor'), value: 'anchor', to: '/base/Anchor' }
])

const codeBasic = demoSfc({
  imports: [`import { RouterNav } from '@amg-webui/core'`],
  template: ['  <RouterNav :items="items" active-match="prefix" />']
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.routerNav.when') }}</p>

    <DemoBlock
      :title="t('example.doc.routerNav.demo.basic')"
      :description="t('example.doc.routerNav.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <RouterNav :items="items" active-match="prefix" />
        <p class="hint">{{ t('example.doc.routerNav.sample.path', { path: route.path }) }}</p>
      </Space>
    </DemoBlock>
</div>
</template>

<style scoped>
.hint {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}
</style>
