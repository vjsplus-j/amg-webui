<script setup lang="ts">
/**
 * Curated demo — Form wave1 ImageUpload
 */
import { computed, ref } from 'vue'
import { ImageUpload } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import type { ImageFileItem } from '@amg-webui/form/ImageUpload/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80">
      <rect width="120" height="80" fill="%23e8eaed"/>
      <text x="60" y="44" text-anchor="middle" font-size="12" fill="%236b7280">preview</text>
    </svg>`
  )

const fileList = ref<ImageFileItem[]>([
  {
    uid: 'mock-1',
    name: 'cover-a.png',
    url: PLACEHOLDER_IMAGE,
    status: 'success'
  },
  {
    uid: 'mock-2',
    name: 'cover-b.png',
    url: PLACEHOLDER_IMAGE,
    status: 'success'
  }
])

const emptyList = ref<ImageFileItem[]>([])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { ImageUpload } from '@amg-webui/form'`
  ],
  script: [`const fileList = ref([/* ImageFileItem mock list */])`],
  template: [`  <ImageUpload v-model="fileList" :max-count="5" />`]
})

const codeEmpty = demoCode(
  `<ImageUpload v-model="emptyList" :max-count="3" />`,
  `<ImageUpload v-model="fileList" disabled />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.imageUpload.prop.modelValue'),
    type: 'ImageFileItem[]',
    defaultValue: '[]'
  },
  {
    name: 'multiple / maxCount',
    description: t('example.doc.imageUpload.prop.multiple'),
    type: 'boolean / number',
    defaultValue: 'true / 9'
  },
  {
    name: 'accept',
    description: t('example.doc.imageUpload.prop.accept'),
    type: 'string',
    defaultValue: "'image/*'"
  },
  {
    name: 'disabled',
    description: t('example.doc.imageUpload.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.imageUpload.event.change'),
    type: '(value: ImageFileItem[]) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.imageUpload.demo.basic')"
      :description="t('example.doc.imageUpload.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <ImageUpload v-model="fileList" :max-count="5" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.imageUpload.demo.empty')"
      :description="t('example.doc.imageUpload.demo.emptyDesc')"
      :code="codeEmpty"
    >
      <div class="vp-curated__row">
        <Space>
          <ImageUpload v-model="emptyList" :max-count="3" />
          <ImageUpload v-model="fileList" disabled />
        </Space>
      </div>
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
