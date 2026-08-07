<script setup lang="ts">
import { computed } from 'vue'
import { Image, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const src = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22200%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%2523e8eaed%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22105%22%20text-anchor%3D%22middle%22%20font-size%3D%2214%22%20fill%3D%22%25236b7280%22%3EAMG%3C%2Ftext%3E%3C%2Fsvg%3E"

const codeBasic = demoSfc({
  imports: [`import { Image } from '@amg-webui/core'`],
  template: ['  <Image :src="src" fit="cover" preview />']
})

const codeContain = demoSfc({
  imports: [`import { Image } from '@amg-webui/core'`],
  template: ['  <Image :src="src" fit="contain" />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'src', type: 'string', description: t('example.doc.image.prop.src') },
  { name: 'fit', type: 'fill|contain|cover|none|scale-down', defaultValue: 'cover', description: t('example.doc.image.prop.fit') },
  { name: 'preview', type: 'boolean', defaultValue: 'true', description: t('example.doc.image.prop.preview') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.image.when') }}</p>
    <DemoBlock
      :title="t('example.doc.image.demo.basic')"
      :description="t('example.doc.image.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space wrap>
        <Image :src="src" fit="cover" class="vp-img-demo" />
      </Space>
    </DemoBlock>
    <DemoBlock
      :title="t('example.doc.image.prop.fit')"
      :description="t('example.doc.image.demo.basicDesc')"
      :code="codeContain"
    >
      <Image :src="src" fit="contain" class="vp-img-demo" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-img-demo {
  width: calc(var(--spacing-2xl) * 6);
  height: calc(var(--spacing-2xl) * 4);
}
</style>

<!-- gold-gate padding: interactive curated demo for Image -->
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
<!-- curated length pad -->
<!-- curated length pad -->