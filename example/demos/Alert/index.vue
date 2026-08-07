<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Alert
 */
import { ref } from 'vue'
import { Alert, Button, Space } from '@amg-webui/core'
import type { AlertSeverity } from '@amg-webui/core/Alert/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t, tDyn } = useLocale()
const resetKey = ref(0)
const severities: AlertSeverity[] = ['info', 'success', 'warning', 'danger']
const sampleKey: Record<AlertSeverity, string> = {
  info: 'example.doc.alert.sample.info',
  success: 'example.doc.alert.sample.success',
  warning: 'example.doc.alert.sample.warning',
  danger: 'example.doc.alert.sample.danger',
  primary: 'example.doc.alert.sample.info',
  secondary: 'example.doc.alert.sample.info',
  error: 'example.doc.alert.sample.danger'
}

function resetClosable() {
  resetKey.value += 1
}

const codeBasic = demoSfc({
  imports: [`import { Alert } from '@amg-webui/core'`],
  template: [
    `  <Alert severity="info">{{ t('example.doc.alert.sample.info') }}</Alert>`,
    `  <Alert severity="success">{{ t('example.doc.alert.sample.success') }}</Alert>`,
    `  <Alert severity="warning">{{ t('example.doc.alert.sample.warning') }}</Alert>`,
    `  <Alert severity="danger">{{ t('example.doc.alert.sample.danger') }}</Alert>`
  ]
})

const codeClosable = demoCode(
  `<Alert :key="key" severity="info" closable @close="onClose">`,
  `  {{ t('example.doc.alert.sample.info') }}`,
  `</Alert>`,
  `<Button @click="reset">{{ t('example.doc.alert.sample.reset') }}</Button>`
)

const codeTitle = demoCode(
  `<Alert severity="warning" :title="t('example.doc.alert.sample.title')">`,
  `  {{ t('example.doc.alert.sample.warning') }}`,
  `</Alert>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.alert.demo.basic')"
      :description="t('example.doc.alert.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__stack">
        <Alert v-for="sev in severities" :key="sev" :severity="sev">
          {{ tDyn(sampleKey[sev]) }}
        </Alert>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.alert.demo.closable')"
      :description="t('example.doc.alert.demo.closableDesc')"
      :code="codeClosable"
    >
      <div class="vp-curated__row">
        <Space>
          <Alert :key="resetKey" severity="info" closable>
            {{ t('example.doc.alert.sample.info') }}
          </Alert>
          <Button variant="outlined" size="sm" @click="resetClosable">
            {{ t('example.doc.alert.sample.reset') }}
          </Button>
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.alert.demo.title')"
      :description="t('example.doc.alert.demo.titleDesc')"
      :code="codeTitle"
    >
      <Alert severity="warning" :title="t('example.doc.alert.sample.title')">
        {{ t('example.doc.alert.sample.warning') }}
      </Alert>
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

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
