<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Barcode, Card, CardGrid, Space, Tag, Typography } from '@amg-webui/core'
import { InputText, Select } from '@amg-webui/form'
import type { BarcodeFormat } from '@amg-webui/core/Barcode'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

type BarcodeExample = {
  format: BarcodeFormat
  label: string
  value: string
  standard: string
}

const chinaAndGs1: BarcodeExample[] = [
  { format: 'ean13', label: 'EAN-13 / GTIN-13', value: '6901234567892', standard: 'GB 12904 · ISO/IEC 15420' },
  { format: 'ean8', label: 'EAN-8 / GTIN-8', value: '69012341', standard: 'GB 12904 · ISO/IEC 15420' },
  { format: 'gs1-128', label: 'GS1-128', value: '(01)06901234567892(17)261231(10)AMG01', standard: 'GB/T 15425 · ISO/IEC 15417' },
  { format: 'itf14', label: 'ITF-14 / GTIN-14', value: '18931234567894', standard: 'GB/T 16830 · ISO/IEC 16390' },
  { format: 'isbn', label: 'ISBN-13', value: '978-7-115-42802-8', standard: 'GB/T 12906 · ISO 2108' },
  { format: 'issn', label: 'ISSN', value: '1000-0097', standard: 'GB/T 16827 · ISO 3297' },
  { format: 'gs1-databar-omni', label: 'GS1 DataBar Omnidirectional', value: '(01)09501101530003', standard: 'ISO/IEC 24724' },
  { format: 'gs1-databar-expanded', label: 'GS1 DataBar Expanded', value: '(01)09501101530003(17)261231(10)AMG01', standard: 'ISO/IEC 24724' }
]

const internationalRetail: BarcodeExample[] = [
  { format: 'upca', label: 'UPC-A / GTIN-12', value: '012345678905', standard: 'ISO/IEC 15420' },
  { format: 'upce', label: 'UPC-E', value: '01234565', standard: 'ISO/IEC 15420' }
]

const industrial: BarcodeExample[] = [
  { format: 'code128', label: 'Code 128', value: 'AMG-WEBUI-2026', standard: 'ISO/IEC 15417' },
  { format: 'code39', label: 'Code 39', value: 'AMG-2026', standard: 'ISO/IEC 16388' },
  { format: 'code93', label: 'Code 93', value: 'AMG-2026', standard: 'ANSI/AIM BC5' },
  { format: 'interleaved2of5', label: 'Interleaved 2 of 5', value: '1234567890', standard: 'ISO/IEC 16390' },
  { format: 'codabar', label: 'Codabar', value: 'A123456A', standard: 'AIM USS Codabar' },
  { format: 'msi', label: 'MSI / Plessey', value: '1234567', standard: 'MSI Data Corporation' },
  { format: 'pharmacode', label: 'Pharmacode', value: '12345', standard: 'Laetus Pharmacode' }
]

const allExamples = [...chinaAndGs1, ...internationalRetail, ...industrial]
const formatOptions = allExamples.map((item) => ({ label: item.label, value: item.format }))
const activeFormat = ref<BarcodeFormat>('ean13')
const activeValue = ref(chinaAndGs1[0]!.value)

watch(activeFormat, (format) => {
  activeValue.value = allExamples.find((item) => item.format === format)?.value ?? ''
})

const groups = computed(() => [
  { title: t('example.doc.barcode.group.chinaGs1'), items: chinaAndGs1 },
  { title: t('example.doc.barcode.group.retail'), items: internationalRetail },
  { title: t('example.doc.barcode.group.industrial'), items: industrial }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Barcode } from '@amg-webui/core'`
  ],
  script: [
    `const format = ref('ean13')`,
    `const value = ref('6901234567892')`
  ],
  template: [`  <Barcode v-model="value" :format="format" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.barcode.when') }}</p>

    <DemoBlock
      :title="t('example.doc.barcode.demo.editor')"
      :description="t('example.doc.barcode.demo.editorDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="lg">
        <Select v-model="activeFormat" :options="formatOptions" />
        <InputText v-model="activeValue" />
        <Barcode v-model="activeValue" :format="activeFormat" />
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.barcode.demo.standards')"
      :description="t('example.doc.barcode.demo.standardsDesc')"
      default-open
    >
      <Space direction="vertical" block size="xl">
        <section v-for="group in groups" :key="group.title">
          <Typography type="h3">{{ group.title }}</Typography>
          <CardGrid min-track="lg" gap="lg">
            <Card
              v-for="item in group.items"
              :key="item.format"
              :title="item.label"
              :subtitle="item.standard"
            >
              <Barcode
                :model-value="item.value"
                :format="item.format"
                :editable="false"
              />
              <template #footer>
                <Tag size="sm" effect="light">{{ item.format }}</Tag>
              </template>
            </Card>
          </CardGrid>
        </section>
      </Space>
    </DemoBlock>
</div>
</template>
