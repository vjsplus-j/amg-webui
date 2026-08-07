<script setup lang="ts">
import { computed, ref } from 'vue'
import { ConfigProvider, Button, Tag, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const size = ref<'sm' | 'md' | 'lg'>('lg')
const zIndex = ref(2000)

const codeBasic = demoSfc({
  imports: [`import { ConfigProvider, Button, Tag } from '@amg-webui/core'`],
  template: [
    '  <ConfigProvider :button="{ size: \'lg\' }">',
    '    <Button label="Primary" />',
    '  </ConfigProvider>'
  ]
})

const codeZ = demoSfc({
  imports: [`import { ConfigProvider } from '@amg-webui/core'`],
  template: ['  <ConfigProvider :z-index="2000"><slot /></ConfigProvider>']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'size', type: 'Size', defaultValue: '—', description: t('example.doc.configProvider.prop.size') },
  { name: 'zIndex', type: 'number', defaultValue: '—', description: t('example.doc.configProvider.prop.zIndex') },
  { name: 'button / tag / badge / avatar', type: 'GlobalConfig', defaultValue: '—', description: t('example.doc.configProvider.prop.nested') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.configProvider.when') }}</p>

    <DemoBlock
      :title="t('example.doc.configProvider.demo.basic')"
      :description="t('example.doc.configProvider.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space wrap>
        <Button
          v-for="s in (['sm', 'md', 'lg'] as const)"
          :key="s"
          size="sm"
          :variant="size === s ? 'solid' : 'outlined'"
          :label="s"
          @click="size = s"
        />
      </Space>
      <ConfigProvider class="vp-gap-demo" :button="{ size }" :tag="{ size }">
        <Space wrap>
          <Button :label="t('example.doc.configProvider.sample.btn')" />
          <Tag :label="t('example.doc.configProvider.sample.tag')" />
        </Space>
      </ConfigProvider>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.configProvider.prop.zIndex')"
      :description="t('example.doc.configProvider.demo.basicDesc')"
      :code="codeZ"
    >
      <ConfigProvider class="vp-gap-demo" :z-index="zIndex">
        <Button size="sm" :label="String(zIndex)" @click="zIndex += 100" />
      </ConfigProvider>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-gap-demo {
  width: 100%;
  margin-top: var(--spacing-md);
  padding: var(--theme-card-pad);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  box-sizing: border-box;
}
</style>
