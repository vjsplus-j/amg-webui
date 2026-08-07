<script setup lang="ts">
/**
 * Curated demo — Form wave1 Upload
 */
import { computed, ref } from 'vue'
import { Upload } from '@amg-webui/form'
import type { UploadFile } from '@amg-webui/form/Upload/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const files = ref<UploadFile[]>([])
const mockFiles = ref<UploadFile[]>([
  {
    uid: 'demo-1',
    name: 'report.pdf',
    size: 204800,
    status: 'success'
  },
  {
    uid: 'demo-2',
    name: 'screenshot.png',
    size: 102400,
    status: 'ready'
  }
])
const changeCount = ref(0)

function onChange(list: UploadFile[]) {
  changeCount.value += 1
  files.value = list
}

const codeDrag = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Upload } from '@amg-webui/form'`
  ],
  script: [`const files = ref([])`],
  template: [`  <Upload v-model="files" drag multiple />`]
})

const codeList = demoCode(
  `const mockFiles = ref([`,
  `  { uid: 'demo-1', name: 'report.pdf', size: 204800, status: 'success' }`,
  `])`,
  `<Upload v-model="mockFiles" :drag="false" @change="onChange" />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.upload.prop.modelValue'),
    type: 'UploadFile[]',
    defaultValue: '[]'
  },
  {
    name: 'multiple / drag',
    description: t('example.doc.upload.prop.multiple'),
    type: 'boolean',
    defaultValue: 'false / true'
  },
  {
    name: 'accept / beforeUpload',
    description: t('example.doc.upload.prop.accept'),
    type: 'string / fn',
    defaultValue: '—'
  },
  {
    name: 'disabled',
    description: t('example.doc.upload.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'change / remove',
    description: t('example.doc.upload.event.change'),
    type: '(files: UploadFile[]) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.upload.demo.drag')"
      :description="t('example.doc.upload.demo.dragDesc')"
      :code="codeDrag"
      default-open
    >
      <div class="vp-curated__row">
        <Upload v-model="files" drag multiple @change="onChange" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.upload.demo.list')"
      :description="t('example.doc.upload.demo.listDesc')"
      :code="codeList"
    >
      <div class="vp-curated__stack">
        <Upload v-model="mockFiles" :drag="false" @change="onChange" />
        <p class="vp-curated__hint">
          {{ t('example.doc.upload.sample.changeCount', { count: changeCount }) }}
        </p>
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

.vp-curated__stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.vp-curated__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
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
