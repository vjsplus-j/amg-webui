<script setup lang="ts">
import { computed, ref } from 'vue'
import { Confirm, Button } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const open = ref(false)
const openDanger = ref(false)
const openSuccess = ref(false)
const openInfo = ref(false)
const openSecondary = ref(false)
const openContrast = ref(false)

const codeBasic = demoSfc({
  imports: [`import { ref } from 'vue'`, `import { Confirm, Button } from '@amg-webui/components/base'`],
  script: ['const open = ref(false)'],
  template: [
    `  <Button @click="open = true">{{ t('example.doc.confirm.sample.open') }}</Button>`,
    `  <Confirm`,
    `    v-model:visible="open"`,
    `    severity="warning"`,
    `    :title="t('example.doc.confirm.sample.title')"`,
    `    :message="t('example.doc.confirm.sample.body')"`,
    `  />`
  ]
})

const codeDanger = demoSfc({
  imports: [`import { ref } from 'vue'`, `import { Confirm, Button } from '@amg-webui/components/base'`],
  script: ['const open = ref(false)'],
  template: [
    `  <Button severity="danger" @click="open = true">{{ t('example.doc.confirm.sample.openDanger') }}</Button>`,
    `  <Confirm`,
    `    v-model:visible="open"`,
    `    severity="danger"`,
    `    :title="t('example.doc.confirm.sample.titleDanger')"`,
    `    :message="t('example.doc.confirm.sample.bodyDanger')"`,
    `  />`
  ]
})

const codeSuccess = demoSfc({
  imports: [`import { ref } from 'vue'`, `import { Confirm, Button } from '@amg-webui/components/base'`],
  script: ['const open = ref(false)'],
  template: [
    `  <Button severity="success" @click="open = true">{{ t('example.doc.confirm.sample.openSuccess') }}</Button>`,
    `  <Confirm`,
    `    v-model:visible="open"`,
    `    severity="success"`,
    `    :title="t('example.doc.confirm.sample.titleSuccess')"`,
    `    :message="t('example.doc.confirm.sample.bodySuccess')"`,
    `  />`
  ]
})

const codeTones = demoSfc({
  imports: [`import { ref } from 'vue'`, `import { Confirm, Button } from '@amg-webui/components/base'`],
  script: [
    'const openInfo = ref(false)',
    'const openSecondary = ref(false)',
    'const openContrast = ref(false)'
  ],
  template: [
    `  <Button severity="info" @click="openInfo = true">{{ t('example.doc.confirm.sample.openInfo') }}</Button>`,
    `  <Button severity="secondary" @click="openSecondary = true">{{ t('example.doc.confirm.sample.openSecondary') }}</Button>`,
    `  <Button severity="contrast" @click="openContrast = true">{{ t('example.doc.confirm.sample.openContrast') }}</Button>`,
    `  <Confirm v-model:visible="openInfo" severity="info" :title="t('example.doc.confirm.sample.titleInfo')" :message="t('example.doc.confirm.sample.bodyInfo')" />`,
    `  <Confirm v-model:visible="openSecondary" severity="secondary" :title="t('example.doc.confirm.sample.titleSecondary')" :message="t('example.doc.confirm.sample.bodySecondary')" />`,
    `  <Confirm v-model:visible="openContrast" severity="contrast" :title="t('example.doc.confirm.sample.titleContrast')" :message="t('example.doc.confirm.sample.bodyContrast')" />`
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'visible',
    type: 'boolean',
    description: t('example.doc.confirm.prop.visible')
  },
  {
    name: 'severity',
    type: "'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'contrast' | 'primary'",
    description: t('example.doc.confirm.prop.severity')
  },
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.confirm.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.confirm.when') }}</p>
    <DemoBlock
      :title="t('example.doc.confirm.demo.basic')"
      :description="t('example.doc.confirm.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Button severity="primary" :label="t('example.doc.confirm.sample.open')" @click="open = true" />
      </div>
      <Confirm
        v-model:visible="open"
        severity="warning"
        :title="t('example.doc.confirm.sample.title')"
        :message="t('example.doc.confirm.sample.body')"
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.confirm.demo.danger')"
      :description="t('example.doc.confirm.demo.dangerDesc')"
      :code="codeDanger"
    >
      <div class="vp-curated__row">
        <Button
          severity="danger"
          :label="t('example.doc.confirm.sample.openDanger')"
          @click="openDanger = true"
        />
      </div>
      <Confirm
        v-model:visible="openDanger"
        severity="danger"
        :title="t('example.doc.confirm.sample.titleDanger')"
        :message="t('example.doc.confirm.sample.bodyDanger')"
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.confirm.demo.success')"
      :description="t('example.doc.confirm.demo.successDesc')"
      :code="codeSuccess"
    >
      <div class="vp-curated__row">
        <Button
          severity="success"
          :label="t('example.doc.confirm.sample.openSuccess')"
          @click="openSuccess = true"
        />
      </div>
      <Confirm
        v-model:visible="openSuccess"
        severity="success"
        :title="t('example.doc.confirm.sample.titleSuccess')"
        :message="t('example.doc.confirm.sample.bodySuccess')"
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.confirm.demo.tones')"
      :description="t('example.doc.confirm.demo.tonesDesc')"
      :code="codeTones"
    >
      <div class="vp-curated__row">
        <Button
          severity="info"
          :label="t('example.doc.confirm.sample.openInfo')"
          @click="openInfo = true"
        />
        <Button
          severity="secondary"
          :label="t('example.doc.confirm.sample.openSecondary')"
          @click="openSecondary = true"
        />
        <Button
          severity="contrast"
          :label="t('example.doc.confirm.sample.openContrast')"
          @click="openContrast = true"
        />
      </div>
      <Confirm
        v-model:visible="openInfo"
        severity="info"
        :title="t('example.doc.confirm.sample.titleInfo')"
        :message="t('example.doc.confirm.sample.bodyInfo')"
      />
      <Confirm
        v-model:visible="openSecondary"
        severity="secondary"
        :title="t('example.doc.confirm.sample.titleSecondary')"
        :message="t('example.doc.confirm.sample.bodySecondary')"
      />
      <Confirm
        v-model:visible="openContrast"
        severity="contrast"
        :title="t('example.doc.confirm.sample.titleContrast')"
        :message="t('example.doc.confirm.sample.bodyContrast')"
      />
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>
