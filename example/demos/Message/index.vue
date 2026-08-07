<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Message
 */
import { ref } from 'vue'
import { Message } from '@amg-webui/overlay'
import { Button, Space } from '@amg-webui/core'
import type { Severity } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t, tDyn } = useLocale()
const autoHideKey = ref(0)
const showKey = ref(0)
const severities: Severity[] = ['info', 'success', 'warning', 'danger']
const sampleKey: Record<string, string> = {
  info: 'example.doc.message.sample.info',
  success: 'example.doc.message.sample.success',
  warning: 'example.doc.message.sample.warning',
  danger: 'example.doc.message.sample.danger'
}

function remountAutoHide() {
  autoHideKey.value += 1
}

function remountShow() {
  showKey.value += 1
}

const codeBasic = demoSfc({
  imports: [`import { Message } from '@amg-webui/overlay'`],
  template: [
    `  <Message severity="info">{{ t('example.doc.message.sample.info') }}</Message>`,
    `  <Message severity="success">{{ t('example.doc.message.sample.success') }}</Message>`
  ]
})

const codeSeverity = demoCode(
  `<Message severity="info">{{ t('example.doc.message.sample.info') }}</Message>`,
  `<Message severity="success">{{ t('example.doc.message.sample.success') }}</Message>`,
  `<Message severity="warning">{{ t('example.doc.message.sample.warning') }}</Message>`,
  `<Message severity="danger">{{ t('example.doc.message.sample.danger') }}</Message>`
)

const codeAutoHide = demoCode(
  `<Message :key="key" auto-hide :hide-delay="3000">`,
  `  {{ t('example.doc.message.sample.info') }}`,
  `</Message>`,
  `<Button @click="remount">{{ t('example.doc.message.demo.show') }}</Button>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.message.demo.basic')"
      :description="t('example.doc.message.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__stack">
        <Message severity="info">{{ t('example.doc.message.sample.info') }}</Message>
        <Message severity="success">{{ t('example.doc.message.sample.success') }}</Message>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.message.demo.severity')"
      :description="t('example.doc.message.demo.severityDesc')"
      :code="codeSeverity"
    >
      <div class="vp-curated__stack">
        <Message v-for="sev in severities" :key="sev" :severity="sev">
          {{ tDyn(sampleKey[sev]) }}
        </Message>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.message.demo.autoHide')"
      :description="t('example.doc.message.demo.autoHideDesc')"
      :code="codeAutoHide"
    >
      <div class="vp-curated__row">
        <Space direction="vertical">
          <Message :key="autoHideKey" auto-hide :hide-delay="3000">
            {{ t('example.doc.message.sample.info') }}
          </Message>
          <Button variant="outlined" size="sm" @click="remountAutoHide">
            {{ t('example.doc.message.demo.show') }}
          </Button>
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.message.demo.show')"
      :description="t('example.doc.message.demo.showDesc')"
      :code="codeAutoHide"
    >
      <div class="vp-curated__row">
        <Space>
          <Message v-if="showKey > 0" :key="showKey" severity="success">
            {{ t('example.doc.message.sample.success') }}
          </Message>
          <Button severity="primary" size="sm" @click="remountShow">
            {{ t('example.doc.message.demo.show') }}
          </Button>
        </Space>
      </div>
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
