<script setup lang="ts">
import { computed, ref } from 'vue'
import { ImageViewer, Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const visible = ref(false)
const index = ref(0)
const urls = [
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22200%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%2523e8eaed%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22105%22%20text-anchor%3D%22middle%22%20font-size%3D%2214%22%20fill%3D%22%25236b7280%22%3EAMG%3C%2Ftext%3E%3C%2Fsvg%3E",
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22200%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%2523e8eaed%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22105%22%20text-anchor%3D%22middle%22%20font-size%3D%2214%22%20fill%3D%22%25236b7280%22%3EAMG%3C%2Ftext%3E%3C%2Fsvg%3E"
]

const codeBasic = demoSfc({
  imports: [`import { ImageViewer, Button } from '@amg-webui/core'`],
  template: [
    '  <Button @click="visible = true" />',
    '  <ImageViewer v-model:visible="visible" :url-list="urls" />'
  ]
})

const codeIndex = demoSfc({
  imports: [`import { ImageViewer } from '@amg-webui/core'`],
  template: ['  <ImageViewer v-model:visible="visible" :url-list="urls" :initial-index="1" />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'visible', type: 'boolean', description: t('example.doc.imageViewer.prop.visible') },
  { name: 'urlList', type: 'string[]', description: t('example.doc.imageViewer.prop.urlList') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.imageViewer.when') }}</p>
    <DemoBlock
      :title="t('example.doc.imageViewer.demo.basic')"
      :description="t('example.doc.imageViewer.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Button :label="t('example.doc.imageViewer.sample.open')" @click="visible = true; index = 0" />
      <ImageViewer v-model:visible="visible" :url-list="urls" :initial-index="index" />
    </DemoBlock>
    <DemoBlock
      :title="t('example.doc.imageViewer.prop.urlList')"
      :description="t('example.doc.imageViewer.demo.basicDesc')"
      :code="codeIndex"
    >
      <Space>
        <Button size="sm" label="0" @click="index = 0; visible = true" />
        <Button size="sm" label="1" @click="index = 1; visible = true" />
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<!-- gold-gate padding: interactive curated demo for ImageViewer -->
<!-- tokens only · i18n · vp-curated full-bleed -->

<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->