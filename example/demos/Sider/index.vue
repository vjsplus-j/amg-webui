<script setup lang="ts">
import { computed, ref } from 'vue'
import { Layout, Sider, Main, Menu, Button, Space, Avatar } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import type { MenuItem } from '@amg-webui/core/Menu'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const collapsed = ref(false)
const collapsible = ref(true)
const active = ref('home')
const openKeys = ref(['more'])

const menuItems = computed<MenuItem[]>(() => [
  { key: 'home', label: t('example.doc.sider.sample.home'), icon: 'House' },
  { key: 'docs', label: t('example.doc.sider.sample.docs'), icon: 'BookOpen' },
  {
    key: 'more',
    label: t('example.doc.sider.sample.more'),
    icon: 'Folder',
    children: [
      { key: 'a', label: t('example.doc.sider.sample.itemA') },
      { key: 'b', label: t('example.doc.sider.sample.itemB') }
    ]
  }
])

const codeSider = demoSfc({
  imports: [`import { Layout, Sider, Main, Menu } from '@amg-webui/core'`],
  template: [
    '  <Layout has-sider fill>',
    '    <Sider v-model:collapsed="collapsed" collapsible>',
    '      <template #header>…brand…</template>',
    '      <Menu … />',
    '      <template #footer>…user…</template>',
    '    </Sider>',
    '    <Main>…</Main>',
    '  </Layout>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'collapsed / collapsible', type: 'boolean', defaultValue: 'false / true', description: t('example.doc.sider.prop.collapsed') },
  { name: 'width / collapsedWidth', type: 'string', defaultValue: 'var(--ln-sidebar-width)', description: t('example.doc.sider.prop.width') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.sider.when') }}</p>

    <DemoBlock
      :title="t('example.doc.sider.demo.collapse')"
      :description="t('example.doc.sider.demo.collapseDesc')"
      :code="codeSider"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button size="sm" :variant="collapsed ? 'solid' : 'outlined'" @click="collapsed = !collapsed">
            {{
              collapsed
                ? t(LocaleKeys.common.expandMenu)
                : t(LocaleKeys.common.collapseMenu)
            }}
          </Button>
          <Button
            size="sm"
            :variant="collapsible ? 'solid' : 'outlined'"
            @click="collapsible = !collapsible"
          >
            collapsible: {{ collapsible }}
          </Button>
        </Space>
        <div class="sider-stage">
          <Layout has-sider fill class="sider-stage__frame">
            <Sider v-model:collapsed="collapsed" :collapsible="collapsible">
              <template #header>
                <span class="brand">{{ t('example.doc.sider.sample.brand') }}</span>
              </template>
              <Menu
                v-model="active"
                v-model:open-keys="openKeys"
                :items="menuItems"
                :collapsed="collapsed"
              />
              <template #footer>
                <div class="sider-foot">
                  <Avatar size="sm" text="JD" />
                  <span v-if="!collapsed" class="sider-foot__meta">{{
                    t('example.doc.sider.sample.user')
                  }}</span>
                </div>
              </template>
            </Sider>
            <Main>
              <p class="body">{{ t('example.doc.sider.sample.body', { key: active }) }}</p>
            </Main>
          </Layout>
        </div>
      </Space>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.sider-stage {
  width: 100%;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  background: var(--surface-1);
}

.sider-stage__frame {
  height: calc(var(--spacing-2xl) * 12);
  min-height: 0;
}

.brand {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-heading);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sider-foot {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 0;
}

.sider-foot__meta {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.body {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}
</style>
