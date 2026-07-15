<script setup lang="ts">
import { computed } from 'vue'
import { CopyText, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

const propRows = computed<PropRow[]>(() => [
  {
    name: 'text',
    description: t('example.doc.copyText.prop.text'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'label',
    description: t('example.doc.copyText.prop.label'),
    type: 'string',
    defaultValue: 'text'
  },
  {
    name: 'truncate / maxWidth',
    description: t('example.doc.copyText.prop.truncate'),
    type: 'boolean / string',
    defaultValue: 'true / -'
  },
  {
    name: 'showButton',
    description: t('example.doc.copyText.prop.showButton'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: '@copy',
    description: t('example.doc.copyText.emit.copy'),
    type: '(text: string) => void',
    defaultValue: '-'
  },
  {
    name: '@copy-error / @error',
    description: t('example.doc.copyText.emit.copyError'),
    type: '(error: unknown) => void',
    defaultValue: '-'
  }
])

const sampleId = 'usr_8f3a2c91e0b7d4'
const sampleSecret = 'sk_live_********************************'

const codeBasic = `<CopyText text="usr_8f3a2c91e0b7d4" />`

const codeMask = `<CopyText
  text="sk_live_real_secret"
  label="sk_live_********************************"
/>`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.copyText.demo.basic')"
      :description="t('example.doc.copyText.demo.basicDesc')"
      :code="codeBasic"
    >
      <Space direction="vertical">
        <CopyText :text="sampleId" />
        <CopyText :text="sampleId" size="lg" />
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.copyText.demo.mask')"
      :description="t('example.doc.copyText.demo.maskDesc')"
      :code="codeMask"
    >
      <CopyText text="sk_live_demo_secret_value" :label="sampleSecret" />
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <PropsTable :rows="propRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}
</style>
