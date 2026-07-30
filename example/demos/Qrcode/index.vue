<script setup lang="ts">
/**
 * Curated demo — Display wave2 Qrcode
 */
import { computed, ref } from 'vue'
import { Qrcode, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const text = ref('https://amg-webui.example')
const largeText = ref('AMG-WebUI')

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Qrcode } from '@amg-webui/components/base'`
  ],
  script: [`const text = ref('https://amg-webui.example')`],
  template: [`  <Qrcode v-model="text" />`]
})

const codeSize = demoCode(
  `<Qrcode v-model="largeText" :pixel-size="6" />`,
  `<Qrcode v-model="text" disabled />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue / value',
    description: t('example.doc.qrcode.prop.value'),
    type: 'string',
    defaultValue: "''"
  },
  {
    name: 'pixelSize / size',
    description: t('example.doc.qrcode.prop.pixelSize'),
    type: 'number',
    defaultValue: '4 / 21'
  },
  {
    name: 'disabled / loading',
    description: t('example.doc.qrcode.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.qrcode.event.change'),
    type: '(value: string) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.qrcode.demo.basic')"
      :description="t('example.doc.qrcode.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Qrcode v-model="text" />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.qrcode.demo.size')"
      :description="t('example.doc.qrcode.demo.sizeDesc')"
      :code="codeSize"
    >
      <Space wrap>
        <Qrcode v-model="largeText" :pixel-size="6" />
        <Qrcode v-model="text" disabled />
      </Space>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
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
