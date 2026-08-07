<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Popover
 */
import { computed, ref } from 'vue'
import { Popover } from '@amg-webui/overlay'
import { Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const controlled = ref(false)

const codeBasic = demoSfc({
  imports: [`import { Popover } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'`],
  template: [
    `  <Popover :title="t('example.doc.popover.sample.title')">`,
    `    <template #trigger>`,
    `      <Button :label="t('example.doc.popover.sample.trigger')" />`,
    `    </template>`,
    `    {{ t('example.doc.popover.sample.body') }}`,
    `  </Popover>`
  ]
})

const codeControlled = demoCode(
  `<Popover v-model:visible="open" :title="t('example.doc.popover.sample.title')">`,
  `  <template #trigger>`,
  `    <Button :label="t('example.doc.popover.sample.trigger')" />`,
  `  </template>`,
  `  {{ t('example.doc.popover.sample.body') }}`,
  `</Popover>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'visible',
    description: t('example.doc.popover.prop.visible'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'title',
    description: t('example.doc.popover.prop.title'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'placement / dismissible / disabled',
    description: t('example.doc.popover.prop.placement'),
    type: 'string | boolean',
    defaultValue: "'top' / true / false"
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:visible / close',
    description: t('example.doc.popover.event.close'),
    type: '(value: boolean) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'trigger',
    description: t('example.doc.popover.slot.trigger'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'default / title',
    description: t('example.doc.popover.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.popover.demo.basic')"
      :description="t('example.doc.popover.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Popover :title="t('example.doc.popover.sample.title')">
          <template #trigger>
            <Button :label="t('example.doc.popover.sample.trigger')" />
          </template>
          {{ t('example.doc.popover.sample.body') }}
        </Popover>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.popover.demo.controlled')"
      :description="t('example.doc.popover.demo.controlledDesc')"
      :code="codeControlled"
    >
      <div class="vp-curated__row">
        <Space>
          <Popover
            v-model:visible="controlled"
            :title="t('example.doc.popover.sample.title')"
          >
            <template #trigger>
              <Button
                variant="outlined"
                :label="t('example.doc.popover.sample.trigger')"
              />
            </template>
            {{ t('example.doc.popover.sample.body') }}
          </Popover>
          <Button
            size="sm"
            variant="text"
            :label="t('example.doc.popover.sample.close')"
            @click="controlled = false"
          />
        </Space>
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
