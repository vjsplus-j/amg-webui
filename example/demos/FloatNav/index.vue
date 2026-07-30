<script setup lang="ts">
import { computed, ref } from 'vue'
import { FloatNav, Space } from '@amg-webui/components/base'
import type { NavItem } from '@amg-webui/utils/nav'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const active = ref<string | number>('home')

const items = computed<NavItem[]>(() => [
  { label: t('example.doc.floatNav.sample.home'), value: 'home', icon: 'Home' },
  { label: t('example.doc.floatNav.sample.search'), value: 'search', icon: 'Search' },
  { label: t('example.doc.floatNav.sample.settings'), value: 'settings', icon: 'Settings' }
])

const codeBasic = demoSfc({
  imports: [`import { FloatNav } from '@amg-webui/components/base'`],
  template: [
    '  <FloatNav',
    '    v-model="active"',
    '    :items="items"',
    '    placement="bottom-right"',
    '    :teleport="false"',
    '  />'
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'items',
    type: 'NavItem[]',
    defaultValue: '[]',
    description: t('example.doc.floatNav.prop.items')
  },
  {
    name: 'placement',
    type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'",
    defaultValue: "'bottom-right'",
    description: t('example.doc.floatNav.prop.placement')
  },
  {
    name: 'teleport',
    type: 'boolean',
    defaultValue: 'true',
    description: t('example.doc.floatNav.prop.teleport')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.floatNav.when') }}</p>

    <DemoBlock
      :title="t('example.doc.floatNav.demo.basic')"
      :description="t('example.doc.floatNav.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-float-stage">
        <Space direction="vertical" block size="md">
          <p class="hint">
            {{ t('example.doc.floatNav.sample.active', { key: String(active) }) }}
          </p>
        </Space>
        <FloatNav
          class="vp-float-stage__nav"
          v-model="active"
          :items="items"
          placement="bottom-right"
          :teleport="false"
        />
      </div>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-float-stage {
  position: relative;
  width: 100%;
  min-height: calc(var(--spacing-2xl) * 6);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  box-sizing: border-box;
  padding: var(--theme-card-pad);
}

.vp-float-stage__nav {
  position: absolute !important;
  inset-inline-end: var(--spacing-md);
  inset-block-end: var(--spacing-md);
}

.hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
