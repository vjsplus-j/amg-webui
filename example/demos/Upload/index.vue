<script setup lang="ts">
/**
 * Curated demo — Form wave1 Upload
 */
import { ref } from 'vue'
import { Upload } from '@amg-webui/form'
import type { UploadFile } from '@amg-webui/form/Upload/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
</style>
