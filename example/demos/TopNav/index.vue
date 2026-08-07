<script setup lang="ts">
import { computed, ref } from 'vue'
import { TopNav, CardNav, MiniNav, GroupNav, Space } from '@amg-webui/core'
import type { NavItem } from '@amg-webui/utils/nav'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const active = ref<string | number>('home')
const card = ref<string | number>('a')
const mini = ref<string | number>('overview')
const group = ref<string | number>('a1')

const topItems = computed<NavItem[]>(() => [
  { label: t('example.doc.topNav.sample.home'), value: 'home' },
  { label: t('example.doc.topNav.sample.docs'), value: 'docs' },
  { label: t('example.doc.topNav.sample.lab'), value: 'lab' }
])

const cardItems = computed<NavItem[]>(() => [
  { label: t('example.doc.topNav.sample.cardA'), value: 'a', icon: 'A' },
  { label: t('example.doc.topNav.sample.cardB'), value: 'b', icon: 'B' },
  { label: t('example.doc.topNav.sample.cardC'), value: 'c', icon: 'C' }
])

const miniItems = computed<NavItem[]>(() => [
  { label: t('example.doc.topNav.sample.overview'), value: 'overview' },
  { label: t('example.doc.topNav.sample.settings'), value: 'settings' },
  { label: t('example.doc.topNav.sample.account'), value: 'account' }
])

const groupItems = computed<NavItem[]>(() => [
  {
    label: t('example.doc.topNav.sample.groupPrimary'),
    children: [
      { label: t('example.doc.topNav.sample.itemA'), value: 'a1' },
      { label: t('example.doc.topNav.sample.itemB'), value: 'a2' }
    ]
  },
  {
    label: t('example.doc.topNav.sample.groupExtra'),
    children: [{ label: t('example.doc.topNav.sample.itemC'), value: 'b1' }]
  }
])

const codeTop = demoSfc({
  imports: [`import { TopNav } from '@amg-webui/core'`],
  template: ['  <TopNav v-model="active" :items="items" />']
})

const codeCard = demoSfc({
  imports: [`import { CardNav } from '@amg-webui/core'`],
  template: ['  <CardNav v-model="active" :items="items" />']
})

const codeMini = demoSfc({
  imports: [`import { MiniNav } from '@amg-webui/core'`],
  template: ['  <MiniNav v-model="active" :items="items" />']
})

const codeGroup = demoSfc({
  imports: [`import { GroupNav } from '@amg-webui/core'`],
  template: ['  <GroupNav v-model="active" :items="groups" />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'items', type: 'NavItem[]', defaultValue: '[]', description: t('example.doc.topNav.prop.items') },
  { name: 'modelValue', type: 'string | number', defaultValue: '-', description: t('example.doc.topNav.prop.model') },
  { name: 'direction', type: "'horizontal' | 'vertical'", defaultValue: 'varies', description: t('example.doc.topNav.prop.direction') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.topNav.when') }}</p>

    <DemoBlock
      :title="t('example.doc.topNav.demo.top')"
      :description="t('example.doc.topNav.demo.topDesc')"
      :code="codeTop"
      default-open
    >
      <Space direction="vertical" block size="md">
        <TopNav v-model="active" :items="topItems" />
        <p class="hint">{{ t('example.doc.topNav.sample.active', { key: String(active) }) }}</p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.topNav.demo.card')"
      :description="t('example.doc.topNav.demo.cardDesc')"
      :code="codeCard"
    >
      <CardNav v-model="card" :items="cardItems" />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.topNav.demo.mini')"
      :description="t('example.doc.topNav.demo.miniDesc')"
      :code="codeMini"
    >
      <div class="mini-wrap">
        <MiniNav v-model="mini" :items="miniItems" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.topNav.demo.group')"
      :description="t('example.doc.topNav.demo.groupDesc')"
      :code="codeGroup"
    >
      <GroupNav v-model="group" :items="groupItems" />
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.hint {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.mini-wrap {
  width: 100%;
  max-width: 12rem;
  min-width: 0;
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  box-sizing: border-box;
}
</style>
