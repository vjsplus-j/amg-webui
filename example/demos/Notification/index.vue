<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Notification
 */
import { computed, ref } from 'vue'
import { Notification, Button, Space } from '@amg-webui/components/base'
import type { Severity } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const visible = ref(false)
const severity = ref<Severity>('info')

function openNotification(sev: Severity) {
  severity.value = sev
  visible.value = true
}

const codeTrigger = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Notification, Button } from '@amg-webui/components/base'`
  ],
  script: [
    `const visible = ref(false)`,
    `function show() { visible.value = true }`
  ],
  template: [
    `  <Button :label="t('example.doc.notification.sample.show')" @click="show" />`,
    `  <Notification`,
    `    v-model:visible="visible"`,
    `    :title="t('example.doc.notification.sample.title')"`,
    `    :message="t('example.doc.notification.sample.body')"`,
    `  />`
  ]
})

const codeSeverity = demoCode(
  `<Button :label="t('common.info')" @click="open('info')" />`,
  `<Button :label="t('common.success')" @click="open('success')" />`,
  `<Notification v-model:visible="visible" :severity="severity" ... />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'visible',
    description: t('example.doc.notification.prop.visible'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'severity',
    description: t('example.doc.notification.prop.severity'),
    type: "'info' | 'success' | 'warning' | 'danger'",
    defaultValue: "'info'"
  },
  {
    name: 'title / message',
    description: t('example.doc.notification.prop.title'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'duration / position / closable',
    description: t('example.doc.notification.prop.duration'),
    type: 'number / Position / boolean',
    defaultValue: '3000 / top-right / true'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:visible / close',
    description: t('example.doc.notification.event.close'),
    type: '(value: boolean) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default / title',
    description: t('example.doc.notification.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.notification.demo.trigger')"
      :description="t('example.doc.notification.demo.triggerDesc')"
      :code="codeTrigger"
      default-open
    >
      <div class="vp-curated__row">
        <Button
          severity="primary"
          :label="t('example.doc.notification.sample.show')"
          @click="openNotification('info')"
        />
        <Notification
          v-model:visible="visible"
          :severity="severity"
          :title="t('example.doc.notification.sample.title')"
          :message="t('example.doc.notification.sample.body')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.notification.demo.severity')"
      :description="t('example.doc.notification.demo.severityDesc')"
      :code="codeSeverity"
    >
      <div class="vp-curated__row">
        <Space>
          <Button
            variant="outlined"
            :label="t('example.doc.severity.info')"
            @click="openNotification('info')"
          />
          <Button
            variant="outlined"
            severity="success"
            :label="t('example.doc.severity.success')"
            @click="openNotification('success')"
          />
          <Button
            variant="outlined"
            severity="warning"
            :label="t('example.doc.severity.warning')"
            @click="openNotification('warning')"
          />
          <Button
            variant="outlined"
            severity="danger"
            :label="t('example.doc.severity.danger')"
            @click="openNotification('danger')"
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
