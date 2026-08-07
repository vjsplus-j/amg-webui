<script setup lang="ts">
/**
 * Curated TabsNav demo — chrome multi-tabs + overflow + drag reorder.
 */
import { ref, watch, computed } from 'vue'
import { TabsNav, Button, Space } from '@amg-webui/core'
import type { TabsNavItem } from '@amg-webui/core/TabsNav'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t, locale } = useLocale()
const active = ref('a')
const overflowActive = ref('t1')
const dragActive = ref('a')

const items = ref<TabsNavItem[]>([])
const dragItems = ref<TabsNavItem[]>([])

function rebuild() {
  void locale.value
  items.value = [
    { name: 'a', label: t('example.doc.tabsNav.sample.a'), closable: true },
    { name: 'b', label: t('example.doc.tabsNav.sample.b'), closable: true },
    { name: 'c', label: t('example.doc.tabsNav.sample.c'), closable: true }
  ]
  dragItems.value = [
    { name: 'a', label: t('example.doc.tabsNav.sample.a'), closable: true },
    { name: 'b', label: t('example.doc.tabsNav.sample.b'), closable: true },
    { name: 'c', label: t('example.doc.tabsNav.sample.c'), closable: true },
    { name: 'd', label: t('example.doc.tabsNav.sample.tabN', { n: 4 }), closable: true }
  ]
}
rebuild()
watch(locale, rebuild)

const overflowItems = computed(() =>
  Array.from({ length: 12 }, (_, i) => ({
    name: `t${i + 1}`,
    label: t('example.doc.tabsNav.sample.tabN', { n: i + 1 }),
    closable: true
  }))
)

function onClose(name: string) {
  items.value = items.value.filter((i) => i.name !== name)
  if (active.value === name) active.value = items.value[0]?.name ?? ''
}

function resetTabs() {
  rebuild()
  active.value = 'a'
  dragActive.value = 'a'
}

const codeBasic = demoSfc({
  imports: [`import { TabsNav } from '@amg-webui/core'`],
  template: ['  <TabsNav v-model="active" :items="items" closable @close="onClose" />']
})

const codeOverflow = demoSfc({
  imports: [`import { TabsNav } from '@amg-webui/core'`],
  template: ['  <TabsNav v-model="active" :items="many" closable overflow />']
})

const codeDrag = demoSfc({
  imports: [`import { TabsNav } from '@amg-webui/core'`],
  template: [
    '  <TabsNav',
    '    v-model="active"',
    '    v-model:items="items"',
    '    closable',
    '    draggable',
    '  />'
  ]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.tabsNav.when') }}</p>

    <DemoBlock
      :title="t('example.doc.tabsNav.demo.basic')"
      :description="t('example.doc.tabsNav.demo.basicDesc')"
      :code="codeBasic"
    >
      <div class="vp-tabs-demo">
        <TabsNav v-model="active" :items="items" closable @close="onClose" />
        <Space class="vp-tabs-demo__actions">
          <Button size="sm" variant="outlined" @click="resetTabs">
            {{ t(LocaleKeys.button.reset) }}
          </Button>
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tabsNav.demo.overflow')"
      :description="t('example.doc.tabsNav.demo.overflowDesc')"
      :code="codeOverflow"
    >
      <div class="vp-tabs-demo vp-tabs-demo--narrow">
        <TabsNav v-model="overflowActive" :items="overflowItems" closable overflow />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tabsNav.demo.drag')"
      :description="t('example.doc.tabsNav.demo.dragDesc')"
      :code="codeDrag"
      default-open
    >
      <div class="vp-tabs-demo">
        <TabsNav
          v-model="dragActive"
          v-model:items="dragItems"
          closable
          draggable
        />
      </div>
    </DemoBlock>
</div>
</template>

<style scoped>
.vp-tabs-demo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  min-width: 0;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  background: var(--surface-1);
}

.vp-tabs-demo--narrow {
  max-width: 28rem;
}

.vp-tabs-demo__actions {
  padding: 0 var(--theme-page-pad) var(--spacing-md);
}
</style>
