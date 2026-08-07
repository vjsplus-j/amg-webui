<script setup lang="ts">
/**
 * Curated demo — Form wave1 Search
 */
import { ref } from 'vue'
import { Search } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const keyword = ref('')
const cleared = ref('')

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Search } from '@amg-webui/form'`
  ],
  script: [`const keyword = ref('')`],
  template: [
    `  <Search`,
    `    v-model="keyword"`,
    `    :placeholder="t('example.doc.search.sample.placeholder')"`,
    `    fluid`,
    `  />`
  ]
})

const codeClearable = demoCode(
  `<Search`,
  `  v-model="cleared"`,
  `  clearable`,
  `  :placeholder="t('example.doc.search.sample.placeholder')"`,
  `/>`,
  `<Search v-model="cleared" disabled :placeholder="t('example.doc.search.sample.placeholder')" />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.search.demo.basic')"
      :description="t('example.doc.search.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Search
          v-model="keyword"
          :placeholder="t('example.doc.search.sample.placeholder')"
          fluid
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.search.demo.clearable')"
      :description="t('example.doc.search.demo.clearableDesc')"
      :code="codeClearable"
    >
      <div class="vp-curated__row">
        <Space>
          <Search
            v-model="cleared"
            clearable
            :placeholder="t('example.doc.search.sample.placeholder')"
          />
          <Search
            v-model="cleared"
            disabled
            :placeholder="t('example.doc.search.sample.placeholder')"
          />
        </Space>
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

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
