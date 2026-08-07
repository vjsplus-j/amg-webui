<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Toast
 */
import { computed, ref } from 'vue'
import { Toast } from '@amg-webui/overlay'
import { Button, Space } from '@amg-webui/core'
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

function openToast(sev: Severity) {
  severity.value = sev
  visible.value = true
}

const codeTrigger = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Toast } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'`
  ],
  script: [
    `const visible = ref(false)`,
    `function show() { visible.value = true }`
  ],
  template: [
    `  <Button :label="t('example.doc.toast.sample.show')" @click="show" />`,
    `  <Toast`,
    `    v-model:visible="visible"`,
    `    :title="t('example.doc.toast.sample.title')"`,
    `    :message="t('example.doc.toast.sample.body')"`,
    `  />`
  ]
})

const codeSeverity = demoCode(
  `<Button :label="t('common.success')" @click="open('success')" />`,
  `<Toast v-model:visible="visible" :severity="severity" ... />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'visible',
    description: t('example.doc.toast.prop.visible'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'severity',
    description: t('example.doc.toast.prop.severity'),
    type: "'info' | 'success' | 'warning' | 'danger'",
    defaultValue: "'info'"
  },
  {
    name: 'title / message',
    description: t('example.doc.toast.prop.title'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'duration / position / closable',
    description: t('example.doc.toast.prop.duration'),
    type: 'number / Position / boolean',
    defaultValue: '3000 / top-right / true'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:visible / close',
    description: t('example.doc.toast.event.close'),
    type: '(value: boolean) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default / title',
    description: t('example.doc.toast.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.toast.demo.trigger')"
      :description="t('example.doc.toast.demo.triggerDesc')"
      :code="codeTrigger"
      default-open
    >
      <div class="vp-curated__row">
        <Button
          severity="primary"
          :label="t('example.doc.toast.sample.show')"
          @click="openToast('info')"
        />
        <Toast
          v-model:visible="visible"
          :severity="severity"
          :title="t('example.doc.toast.sample.title')"
          :message="t('example.doc.toast.sample.body')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.toast.demo.severity')"
      :description="t('example.doc.toast.demo.severityDesc')"
      :code="codeSeverity"
    >
      <div class="vp-curated__row">
        <Space>
          <Button
            variant="outlined"
            :label="t('example.doc.severity.info')"
            @click="openToast('info')"
          />
          <Button
            variant="outlined"
            severity="success"
            :label="t('example.doc.severity.success')"
            @click="openToast('success')"
          />
          <Button
            variant="outlined"
            severity="warning"
            :label="t('example.doc.severity.warning')"
            @click="openToast('warning')"
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
