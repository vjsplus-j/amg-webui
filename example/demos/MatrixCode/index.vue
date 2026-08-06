<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Card,
  CardGrid,
  InputText,
  MatrixCode,
  Select,
  Space,
  Tag,
  Typography
} from '@amg-webui/components/base'
import type { MatrixCodeFormat } from '@amg-webui/components/base/MatrixCode'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

type MatrixCodeExample = {
  format: MatrixCodeFormat
  label: string
  value: string
  standard: string
}

const gs1Value = '(01)09501101530003(17)261231(10)AMG01'
const gs1DigitalLink = 'https://id.gs1.org/01/09501101530003/10/AMG01'
const hibcValue = 'A123BJC5D6E71'
const swissQrValue = [
  'SPC',
  '0200',
  '1',
  'CH4431999123000889012',
  'S',
  'AMG WebUI',
  '',
  'Teststrasse',
  '1',
  '8000',
  'Zurich',
  'CH',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'CHF',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'NON',
  '',
  ''
].join('\n')

const qrFamily: MatrixCodeExample[] = [
  { format: 'qrcode', label: 'QR Code', value: 'AMG-WebUI QR Code', standard: 'GB/T 18284 · ISO/IEC 18004 · JIS X 0510' },
  { format: 'microqrcode', label: 'Micro QR Code', value: '12345', standard: 'ISO/IEC 18004' },
  { format: 'rmqr', label: 'Rectangular Micro QR Code', value: 'AMG-WEBUI', standard: 'rMQR' },
  { format: 'gs1qrcode', label: 'GS1 QR Code', value: gs1Value, standard: 'GS1 QR Code' },
  { format: 'gs1dlqrcode', label: 'GS1 Digital Link QR', value: gs1DigitalLink, standard: 'GS1 Digital Link QR Code' },
  { format: 'hibcqrcode', label: 'HIBC QR Code', value: hibcValue, standard: 'HIBC QR Code' },
  { format: 'swissqrcode', label: 'Swiss QR Code', value: swissQrValue, standard: 'Swiss QR-bill profile' }
]

const matrixFamily: MatrixCodeExample[] = [
  { format: 'datamatrix', label: 'Data Matrix', value: 'AMG-WebUI Data Matrix', standard: 'ISO/IEC 16022' },
  { format: 'datamatrix-rectangular', label: 'Data Matrix Rectangular', value: 'AMG-WEBUI', standard: 'ISO/IEC 16022' },
  { format: 'datamatrix-rectangular-extension', label: 'Data Matrix Rectangular Extension', value: 'DMRE-1234567890', standard: 'DMRE' },
  { format: 'gs1datamatrix', label: 'GS1 DataMatrix', value: gs1Value, standard: 'GS1 DataMatrix' },
  { format: 'gs1datamatrix-rectangular', label: 'GS1 DataMatrix Rectangular', value: gs1Value, standard: 'GS1 DataMatrix' },
  { format: 'gs1dldatamatrix', label: 'GS1 Digital Link DataMatrix', value: gs1DigitalLink, standard: 'GS1 Digital Link DataMatrix' },
  { format: 'dotcode', label: 'DotCode', value: 'DOTCODE-123456', standard: 'DotCode' },
  { format: 'gs1dotcode', label: 'GS1 DotCode', value: gs1Value, standard: 'GS1 DotCode' },
  { format: 'hanxin', label: 'Han Xin Code', value: 'AMG-WebUI 汉信码', standard: 'Han Xin Code' },
  { format: 'maxicode', label: 'MaxiCode', value: 'AMG-WebUI MaxiCode', standard: 'ISO/IEC 16023' },
  { format: 'codeone', label: 'Code One', value: 'CODEONE-DEMO', standard: 'Code One' },
  { format: 'hibcdatamatrix', label: 'HIBC DataMatrix', value: hibcValue, standard: 'HIBC DataMatrix' },
  { format: 'hibcdatamatrix-rectangular', label: 'HIBC DataMatrix Rectangular', value: hibcValue, standard: 'HIBC DataMatrix' },
  { format: 'ultracode', label: 'Ultracode', value: 'AMG-WebUI Ultracode', standard: 'Ultracode' }
]

const stackedFamily: MatrixCodeExample[] = [
  { format: 'pdf417', label: 'PDF417', value: 'AMG-WebUI PDF417 payload', standard: 'ISO/IEC 15438' },
  { format: 'pdf417-compact', label: 'Compact PDF417', value: 'AMG-WebUI compact PDF417', standard: 'ISO/IEC 15438' },
  { format: 'micropdf417', label: 'MicroPDF417', value: 'AMG-WEBUI', standard: 'ISO/IEC 24728' },
  { format: 'hibcpdf417', label: 'HIBC PDF417', value: hibcValue, standard: 'HIBC PDF417' },
  { format: 'hibcmicropdf417', label: 'HIBC MicroPDF417', value: hibcValue, standard: 'HIBC MicroPDF417' },
  { format: 'azteccode', label: 'Aztec Code', value: 'AMG-WebUI Aztec', standard: 'ISO/IEC 24778' },
  { format: 'azteccode-compact', label: 'Compact Aztec Code', value: 'AMG', standard: 'ISO/IEC 24778' },
  { format: 'aztecrune', label: 'Aztec Rune', value: '123', standard: 'Aztec Rune' },
  { format: 'hibcazteccode', label: 'HIBC Aztec Code', value: hibcValue, standard: 'HIBC Aztec Code' },
  { format: 'code49', label: 'Code 49', value: 'AMGWEBUI2026', standard: 'ANSI/AIM BC6' },
  { format: 'code16k', label: 'Code 16K', value: 'AMGWEBUI2026', standard: 'AIM USS Code 16K' },
  { format: 'codablockf', label: 'Codablock F', value: 'CODABLOCKF-123456', standard: 'Codablock F' },
  { format: 'hibccodablockf', label: 'HIBC Codablock F', value: hibcValue, standard: 'HIBC Codablock F' }
]

const allExamples = [...qrFamily, ...matrixFamily, ...stackedFamily]
const formatOptions = allExamples.map((item) => ({ label: item.label, value: item.format }))
const activeFormat = ref<MatrixCodeFormat>('datamatrix')
const activeValue = ref(matrixFamily[0]!.value)

watch(activeFormat, (format) => {
  activeValue.value = allExamples.find((item) => item.format === format)?.value ?? ''
})

const groups = computed(() => [
  { title: t('example.doc.matrixCode.group.qr'), items: qrFamily },
  { title: t('example.doc.matrixCode.group.matrix'), items: matrixFamily },
  { title: t('example.doc.matrixCode.group.stacked'), items: stackedFamily }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { MatrixCode } from '@amg-webui/components/base'`
  ],
  script: [
    `const format = ref('datamatrix')`,
    `const value = ref('AMG-WebUI Data Matrix')`
  ],
  template: [`  <MatrixCode v-model="value" :format="format" />`]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'value / v-model', type: 'string | number', defaultValue: "''", description: t('example.doc.matrixCode.prop.value') },
  { name: 'format', type: 'MatrixCodeFormat', defaultValue: 'qrcode', description: t('example.doc.matrixCode.prop.format') },
  { name: 'pixelSize / quietZone', type: 'number', defaultValue: '4 / 8', description: t('example.doc.matrixCode.prop.render') },
  { name: 'errorCorrection / version', type: 'string | number', description: t('example.doc.matrixCode.prop.options') },
  { name: 'editable / disabled / loading', type: 'boolean', defaultValue: 'true / false / false', description: t('example.doc.matrixCode.prop.state') },
  { name: 'class / style', type: 'BaseProps', description: t('example.doc.matrixCode.prop.base') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.matrixCode.when') }}</p>

    <DemoBlock
      :title="t('example.doc.matrixCode.demo.editor')"
      :description="t('example.doc.matrixCode.demo.editorDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="lg">
        <Select v-model="activeFormat" :options="formatOptions" />
        <InputText v-model="activeValue" />
        <MatrixCode v-model="activeValue" :format="activeFormat" />
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.matrixCode.demo.standards')"
      :description="t('example.doc.matrixCode.demo.standardsDesc')"
      default-open
    >
      <Space direction="vertical" block size="xl">
        <section v-for="group in groups" :key="group.title">
          <Typography type="h3">{{ group.title }}</Typography>
          <CardGrid min-track="md" gap="lg">
            <Card
              v-for="item in group.items"
              :key="item.format"
              :title="item.label"
              :subtitle="item.standard"
            >
              <Space direction="vertical" block size="md">
                <MatrixCode
                  :model-value="item.value"
                  :format="item.format"
                  :editable="false"
                />
                <Typography type="body-sm">{{ item.value }}</Typography>
              </Space>
              <template #footer>
                <Tag size="sm" effect="light">{{ item.format }}</Tag>
              </template>
            </Card>
          </CardGrid>
        </section>
      </Space>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>
