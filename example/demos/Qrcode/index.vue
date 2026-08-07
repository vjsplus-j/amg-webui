<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Card, CardGrid, Qrcode, Space, Tag, Typography } from '@amg-webui/core'
import { InputText, Select } from '@amg-webui/form'
import type {
  QrcodeErrorCorrectionLevel,
  QrcodeStandard
} from '@amg-webui/core/Qrcode'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t, tDyn } = useLocale()

type QrcodeExample = {
  standard: QrcodeStandard
  titleKey: string
  value: string
  standardText: string
  errorCorrection: QrcodeErrorCorrectionLevel
}

const examples: QrcodeExample[] = [
  {
    standard: 'gb',
    titleKey: 'example.doc.qrcode.standard.gb',
    value: 'AMG-WebUI 国标二维码',
    standardText: 'GB/T 18284',
    errorCorrection: 'M'
  },
  {
    standard: 'iso',
    titleKey: 'example.doc.qrcode.standard.iso',
    value: 'https://amg-webui.example/iso-iec-18004',
    standardText: 'ISO/IEC 18004',
    errorCorrection: 'Q'
  },
  {
    standard: 'jis',
    titleKey: 'example.doc.qrcode.standard.jis',
    value: 'AMG-WebUI 日本 QR コード',
    standardText: 'JIS X 0510',
    errorCorrection: 'Q'
  },
  {
    standard: 'aim',
    titleKey: 'example.doc.qrcode.standard.aim',
    value: 'AIM ISS QR CODE',
    standardText: 'AIM ISS QR Code',
    errorCorrection: 'H'
  }
]

const errorCorrectionOptions = [
  { label: 'L', value: 'L' },
  { label: 'M', value: 'M' },
  { label: 'Q', value: 'Q' },
  { label: 'H', value: 'H' }
]

const activeStandard = ref<QrcodeStandard>('gb')
const activeValue = ref(examples[0]!.value)
const activeErrorCorrection = ref<QrcodeErrorCorrectionLevel>(examples[0]!.errorCorrection)

const standardOptions = computed(() =>
  examples.map((item) => ({ label: tDyn(item.titleKey), value: item.standard }))
)

watch(activeStandard, (standard) => {
  const example = examples.find((item) => item.standard === standard)
  if (!example) return
  activeValue.value = example.value
  activeErrorCorrection.value = example.errorCorrection
})

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Qrcode } from '@amg-webui/core'`
  ],
  script: [
    `const standard = ref('gb')`,
    `const value = ref('AMG-WebUI 国标二维码')`
  ],
  template: [`  <Qrcode v-model="value" :standard="standard" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.qrcode.when') }}</p>

    <DemoBlock
      :title="t('example.doc.qrcode.demo.editor')"
      :description="t('example.doc.qrcode.demo.editorDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="lg">
        <Select v-model="activeStandard" :options="standardOptions" />
        <Select v-model="activeErrorCorrection" :options="errorCorrectionOptions" />
        <InputText v-model="activeValue" />
        <Qrcode
          v-model="activeValue"
          :standard="activeStandard"
          :error-correction="activeErrorCorrection"
        />
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.qrcode.demo.standards')"
      :description="t('example.doc.qrcode.demo.standardsDesc')"
      default-open
    >
      <CardGrid min-track="md" gap="lg">
        <Card
          v-for="item in examples"
          :key="item.standard"
          :title="tDyn(item.titleKey)"
          :subtitle="item.standardText"
        >
          <Space direction="vertical" block size="md">
            <Qrcode
              :model-value="item.value"
              :standard="item.standard"
              :error-correction="item.errorCorrection"
              :editable="false"
            />
            <Typography type="body-sm">{{ item.value }}</Typography>
          </Space>
          <template #footer>
            <Tag size="sm" effect="light">{{ item.standard }}</Tag>
            <Tag size="sm" effect="light">{{ item.errorCorrection }}</Tag>
          </template>
        </Card>
      </CardGrid>
    </DemoBlock>
  </div>
</template>
