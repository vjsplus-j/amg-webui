<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Popconfirm
 */
import { computed, ref } from 'vue'
import { Popconfirm, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const confirmed = ref(false)

function onConfirm() {
  confirmed.value = true
  window.setTimeout(() => {
    confirmed.value = false
  }, 2000)
}

const codeBasic = demoSfc({
  imports: [`import { Popconfirm, Button } from '@amg-webui/components/base'`],
  template: [
    `  <Popconfirm :title="t('example.doc.popconfirm.sample.title')">`,
    `    <template #trigger>`,
    `      <Button severity="danger" :label="t('example.doc.popconfirm.sample.trigger')" />`,
    `    </template>`,
    `  </Popconfirm>`
  ]
})

const codeEvent = demoSfc({
  imports: [`import { Popconfirm, Button } from '@amg-webui/components/base'`],
  script: [`function onConfirm() { /* handle confirm */ }`],
  template: [
    `  <Popconfirm :title="t('example.doc.popconfirm.sample.title')" @confirm="onConfirm">`,
    `    <template #trigger>`,
    `      <Button severity="danger" :label="t('example.doc.popconfirm.sample.trigger')" />`,
    `    </template>`,
    `  </Popconfirm>`
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'visible',
    description: t('example.doc.popconfirm.prop.visible'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'title',
    description: t('example.doc.popconfirm.prop.title'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'placement / dismissible / disabled',
    description: t('example.doc.popconfirm.prop.placement'),
    type: 'string | boolean',
    defaultValue: "'top' / true / false"
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'confirm',
    description: t('example.doc.popconfirm.event.confirm'),
    type: '(event: Event) => void',
    defaultValue: '-'
  },
  {
    name: 'cancel / update:visible',
    description: t('example.doc.popconfirm.event.cancel'),
    type: '(event: Event) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'trigger',
    description: t('example.doc.popconfirm.slot.trigger'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'default',
    description: t('example.doc.popconfirm.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.popconfirm.demo.basic')"
      :description="t('example.doc.popconfirm.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Popconfirm :title="t('example.doc.popconfirm.sample.title')">
          <template #trigger>
            <Button
              severity="danger"
              :label="t('example.doc.popconfirm.sample.trigger')"
            />
          </template>
        </Popconfirm>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.popconfirm.demo.event')"
      :description="t('example.doc.popconfirm.demo.eventDesc')"
      :code="codeEvent"
    >
      <div class="vp-curated__row">
        <Space>
          <Popconfirm
            :title="t('example.doc.popconfirm.sample.title')"
            @confirm="onConfirm"
          >
            <template #trigger>
              <Button
                severity="danger"
                :label="t('example.doc.popconfirm.sample.trigger')"
              />
            </template>
          </Popconfirm>
          <span v-if="confirmed" class="vp-curated__hint">
            {{ t('example.doc.popconfirm.sample.confirmed') }}
          </span>
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

.vp-curated__hint {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
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
