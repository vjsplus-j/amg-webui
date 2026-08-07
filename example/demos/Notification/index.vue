<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Notification
 */
import { ref } from 'vue'
import { Notification } from '@amg-webui/overlay'
import { Button, Space } from '@amg-webui/core'
import type { Severity } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
    `import { Notification } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'`
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
</style>
