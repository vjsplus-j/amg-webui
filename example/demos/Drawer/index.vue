<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Drawer
 */
import { computed, ref } from 'vue'
import { Drawer } from '@amg-webui/overlay'
import { Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const basicOpen = ref(false)
const leftOpen = ref(false)
const rightOpen = ref(false)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Drawer } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'`
  ],
  script: ['const open = ref(false)'],
  template: [
    `  <Button severity="primary" :label="t('example.doc.drawer.sample.open')" @click="open = true" />`,
    `  <Drawer v-model:visible="open" :title="t('example.doc.drawer.sample.title')">`,
    `    {{ t('example.doc.drawer.sample.body') }}`,
    `  </Drawer>`
  ]
})

const codePlacement = demoCode(
  `<Button :label="t('example.doc.drawer.sample.openLeft')" @click="leftOpen = true" />`,
  `<Button :label="t('example.doc.drawer.sample.openRight')" @click="rightOpen = true" />`,
  `<Drawer v-model:visible="leftOpen" placement="left" :title="t('example.doc.drawer.sample.title')">`,
  `  {{ t('example.doc.drawer.sample.body') }}`,
  `</Drawer>`,
  `<Drawer v-model:visible="rightOpen" placement="right" :title="t('example.doc.drawer.sample.title')">`,
  `  {{ t('example.doc.drawer.sample.body') }}`,
  `</Drawer>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'visible',
    description: t('example.doc.drawer.prop.visible'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'placement',
    description: t('example.doc.drawer.prop.placement'),
    type: "'left' | 'right'",
    defaultValue: "'right'"
  },
  {
    name: 'title / width / closable / dismissible',
    description: t('example.doc.drawer.prop.title'),
    type: 'string | boolean',
    defaultValue: '—'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:visible / close / show / hide',
    description: t('example.doc.drawer.event.visible'),
    type: '(value: boolean | Event) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.drawer.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'header / footer',
    description: t('example.doc.drawer.slot.footer'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.drawer.demo.basic')"
      :description="t('example.doc.drawer.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Button
          severity="primary"
          :label="t('example.doc.drawer.sample.open')"
          @click="basicOpen = true"
        />
        <Drawer v-model:visible="basicOpen" :title="t('example.doc.drawer.sample.title')">
          {{ t('example.doc.drawer.sample.body') }}
        </Drawer>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.drawer.demo.placement')"
      :description="t('example.doc.drawer.demo.placementDesc')"
      :code="codePlacement"
    >
      <div class="vp-curated__row">
        <Space>
          <Button
            variant="outlined"
            :label="t('example.doc.drawer.sample.openLeft')"
            @click="leftOpen = true"
          />
          <Button
            variant="outlined"
            :label="t('example.doc.drawer.sample.openRight')"
            @click="rightOpen = true"
          />
        </Space>
        <Drawer
          v-model:visible="leftOpen"
          placement="left"
          :title="t('example.doc.drawer.sample.title')"
        >
          {{ t('example.doc.drawer.sample.body') }}
        </Drawer>
        <Drawer
          v-model:visible="rightOpen"
          placement="right"
          :title="t('example.doc.drawer.sample.title')"
        >
          {{ t('example.doc.drawer.sample.body') }}
        </Drawer>
      </div>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  gap: var(--spacing-md);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-secondary);
}
</style>
