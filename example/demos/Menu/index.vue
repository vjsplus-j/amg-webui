<script setup lang="ts">
/**
 * Curated demo — Nav wave1 Menu
 */
import { computed, ref } from 'vue'
import { Menu, Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { MenuItem } from '@amg-webui/core/Menu'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const active = ref('home')
const openKeys = ref(['more'])
const collapsed = ref(false)
const hActive = ref('home')

const menuItems = computed<MenuItem[]>(() => [
  { key: 'home', label: t('example.doc.menu.sample.home'), icon: 'House' },
  { key: 'docs', label: t('example.doc.menu.sample.docs'), icon: 'BookOpen' },
  {
    key: 'more',
    label: t('example.doc.menu.sample.more'),
    icon: 'Folder',
    children: [
      { key: 'a', label: t('example.doc.menu.sample.itemA') },
      { key: 'b', label: t('example.doc.menu.sample.itemB') }
    ]
  },
  { key: 'settings', label: t('example.doc.menu.sample.settings'), icon: 'Settings' }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { Menu } from '@amg-webui/core'`
  ],
  script: [
    `const active = ref('home')`,
    `const openKeys = ref(['more'])`,
    `const collapsed = ref(false)`
  ],
  template: [
    `  <Menu`,
    `    v-model="active"`,
    `    v-model:open-keys="openKeys"`,
    `    :items="items"`,
    `    :collapsed="collapsed"`,
    `  />`
  ]
})

const codeHorizontal = demoCode(
  `<Menu v-model="hActive" direction="horizontal" mode="popup" :items="items" />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.menu.demo.basic')"
      :description="t('example.doc.menu.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Button
          size="sm"
          :variant="collapsed ? 'solid' : 'outlined'"
          :label="t('example.doc.menu.demo.collapsedToggle')"
          @click="collapsed = !collapsed"
        />
        <div class="menu-panel" :class="{ 'menu-panel--collapsed': collapsed }">
          <Menu
            v-model="active"
            v-model:open-keys="openKeys"
            :items="menuItems"
            :collapsed="collapsed"
          />
        </div>
        <p class="vp-curated__hint">
          {{ t('example.doc.menu.sample.active', { key: active }) }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.menu.demo.horizontal')"
      :description="t('example.doc.menu.demo.horizontalDesc')"
      :code="codeHorizontal"
    >
      <div class="menu-bar-panel">
        <Menu v-model="hActive" direction="horizontal" mode="popup" :items="menuItems" />
      </div>
      <p class="vp-curated__hint">
        {{ t('example.doc.menu.sample.active', { key: hActive }) }}
      </p>
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.menu-panel {
  width: 100%;
  max-width: calc(var(--ln-sidebar-width) + var(--spacing-2xl));
  min-width: 0;
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  box-sizing: border-box;
  transition: max-width var(--transition-normal, 0.2s ease);
}

.menu-panel--collapsed {
  max-width: calc(var(--ln-sidebar-width-collapsed) + var(--spacing-2xl) * 2);
}

.menu-bar-panel {
  width: 100%;
  min-width: 0;
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  box-sizing: border-box;
}

.vp-curated__hint {
  margin: var(--spacing-md) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
