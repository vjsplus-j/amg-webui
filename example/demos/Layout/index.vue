<script setup lang="ts">
/**
 * Layout — shell composition with Menu ↔ TabsNav ↔ Main interaction.
 */
import { computed, ref, watch } from 'vue'
import { Layout, Sider, Header, Main, Footer, Menu, TabsNav, Space, Button, Card } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import type { MenuItem } from '@amg-webui/core/Menu'
import type { TabsNavItem } from '@amg-webui/core/TabsNav'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const collapsed = ref(false)
const active = ref('home')
const openKeys = ref(['more'])
const tab = ref('home')

type PanelKey = 'home' | 'docs' | 'a' | 'b'

const menuItems = computed<MenuItem[]>(() => [
  { key: 'home', label: t('example.doc.layout.sample.home'), icon: 'House' },
  { key: 'docs', label: t('example.doc.layout.sample.docs'), icon: 'BookOpen' },
  {
    key: 'more',
    label: t('example.doc.layout.sample.more'),
    icon: 'Folder',
    children: [
      { key: 'a', label: t('example.doc.layout.sample.itemA') },
      { key: 'b', label: t('example.doc.layout.sample.itemB') }
    ]
  }
])

const labelOf = (key: string) => {
  const map: Record<string, string> = {
    home: t('example.doc.layout.sample.home'),
    docs: t('example.doc.layout.sample.docs'),
    a: t('example.doc.layout.sample.itemA'),
    b: t('example.doc.layout.sample.itemB')
  }
  return map[key] ?? key
}

const tabs = ref<TabsNavItem[]>([
  { name: 'home', label: '', closable: false }
])

watch(
  () => t('example.doc.layout.sample.home'),
  () => {
    tabs.value = tabs.value.map((item) => ({
      ...item,
      label: labelOf(item.name)
    }))
  },
  { immediate: true }
)

function openPanel(key: string) {
  if (!tabs.value.some((item) => item.name === key)) {
    tabs.value = [
      ...tabs.value,
      { name: key, label: labelOf(key), closable: key !== 'home' }
    ]
  } else {
    tabs.value = tabs.value.map((item) =>
      item.name === key ? { ...item, label: labelOf(key) } : item
    )
  }
  tab.value = key
  active.value = key
}

function onMenuChange(key: string) {
  openPanel(key)
}

function onTabChange(name: string) {
  tab.value = name
  active.value = name
  if (name === 'a' || name === 'b') {
    if (!openKeys.value.includes('more')) openKeys.value = [...openKeys.value, 'more']
  }
}

function onTabClose(name: string) {
  if (name === 'home') return
  const idx = tabs.value.findIndex((item) => item.name === name)
  if (idx < 0) return
  const next = tabs.value.filter((item) => item.name !== name)
  tabs.value = next.length ? next : [{ name: 'home', label: labelOf('home'), closable: false }]
  if (tab.value === name) {
    const fallback = tabs.value[Math.max(0, idx - 1)] ?? tabs.value[0]
    onTabChange(fallback.name)
  }
}

const headerTitle = computed(() => labelOf(tab.value))

const panelBody = computed(() =>
  t(`example.doc.layout.sample.panel.${tab.value as PanelKey}`)
)

const codeShell = demoSfc({
  imports: [
    `import { Layout, Sider, Header, Main, Footer, Menu, TabsNav } from '@amg-webui/core'`
  ],
  template: [
    '  <Layout has-sider fill>',
    '    <Sider v-model:collapsed="collapsed" collapsible>',
    '      <Menu v-model="active" :items="items" @change="openPanel" />',
    '    </Sider>',
    '    <Layout>',
    '      <Header>…</Header>',
    '      <TabsNav v-model="tab" :items="tabs" closable @close="onTabClose" />',
    '      <Main>{{ panelBody }}</Main>',
    '      <Footer>…</Footer>',
    '    </Layout>',
    '  </Layout>'
  ]
})

const codeStack = demoSfc({
  imports: [`import { Layout, Header, Main, Footer } from '@amg-webui/core'`],
  template: [
    '  <Layout fill>',
    '    <Header>…</Header>',
    '    <Main>…</Main>',
    '    <Footer>…</Footer>',
    '  </Layout>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'hasSider',
    type: 'boolean',
    defaultValue: 'false',
    description: t('example.doc.layout.prop.hasSider')
  },
  {
    name: 'shell / fill',
    type: 'boolean',
    defaultValue: 'false',
    description: t('example.doc.layout.prop.shell')
  },
  {
    name: 'direction',
    type: "'horizontal'|'vertical'",
    defaultValue: "'vertical'",
    description: t('example.doc.layout.prop.direction')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.layout.when') }}</p>

    <DemoBlock
      :title="t('example.doc.layout.demo.shell')"
      :description="t('example.doc.layout.demo.shellDesc')"
      :code="codeShell"
      default-open
    >
      <div class="shell">
        <Layout has-sider fill class="shell__frame">
          <Sider v-model:collapsed="collapsed" collapsible>
            <template #header>
              <span class="brand">{{ t('example.doc.layout.sample.brand') }}</span>
            </template>
            <Menu
              v-model="active"
              v-model:open-keys="openKeys"
              :items="menuItems"
              :collapsed="collapsed"
              @change="onMenuChange"
            />
          </Sider>
          <Layout>
            <Header>
              <template #title>{{ headerTitle }}</template>
              <template #actions>
                <Button size="sm" variant="outlined" @click="collapsed = !collapsed">
                  {{
                    collapsed
                      ? t(LocaleKeys.common.expandMenu)
                      : t(LocaleKeys.common.collapseMenu)
                  }}
                </Button>
              </template>
            </Header>
            <TabsNav
              v-model="tab"
              :items="tabs"
              closable
              @change="onTabChange"
              @close="onTabClose"
            />
            <Main>
              <Card>
                <p class="content">{{ panelBody }}</p>
              </Card>
            </Main>
            <Footer>{{ t(LocaleKeys.chrome.brandFoot) }}</Footer>
          </Layout>
        </Layout>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.layout.demo.stack')"
      :description="t('example.doc.layout.demo.stackDesc')"
      :code="codeStack"
    >
      <div class="shell">
        <Layout fill class="shell__frame shell__frame--stack">
          <Header bordered>
            <template #title>{{ t('example.doc.layout.sample.stackTitle') }}</template>
          </Header>
          <Main>
            <Space direction="vertical" block size="md">
              <p class="content">{{ t('example.doc.layout.sample.stackBody') }}</p>
              <p v-for="n in 4" :key="n" class="content">
                {{ t('example.doc.layout.sample.line', { n }) }}
              </p>
            </Space>
          </Main>
          <Footer align="center">{{ t(LocaleKeys.chrome.brandFoot) }}</Footer>
        </Layout>
      </div>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.shell {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  background: var(--surface-1);
}

.shell__frame {
  height: calc(var(--spacing-2xl) * 14);
  min-height: 0;
}

.shell__frame--stack {
  height: calc(var(--spacing-2xl) * 10);
}

.brand {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-heading);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
  color: var(--text-secondary);
}
</style>
