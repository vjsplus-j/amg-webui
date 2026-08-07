<script setup lang="ts">
/**
 * Curated demo — Form wave1 TagInput
 */
import { ref } from 'vue'
import { TagInput } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const tags = ref<string[]>(['vue', 'amg'])
const limited = ref<string[]>(['alpha'])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { TagInput } from '@amg-webui/form'`
  ],
  script: [`const tags = ref(['vue', 'amg'])`],
  template: [
    `  <TagInput`,
    `    v-model="tags"`,
    `    :placeholder="t('example.doc.tagInput.sample.placeholder')"`,
    `    fluid`,
    `  />`
  ]
})

const codeLimit = demoCode(
  `<TagInput`,
  `  v-model="limited"`,
  `  :max="3"`,
  `  unique`,
  `  :placeholder="t('example.doc.tagInput.sample.placeholder')"`,
  `/>`,
  `<TagInput v-model="limited" disabled />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.tagInput.demo.basic')"
      :description="t('example.doc.tagInput.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <TagInput
          v-model="tags"
          :placeholder="t('example.doc.tagInput.sample.placeholder')"
          fluid
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tagInput.demo.limit')"
      :description="t('example.doc.tagInput.demo.limitDesc')"
      :code="codeLimit"
    >
      <div class="vp-curated__row">
        <Space direction="vertical">
          <TagInput
            v-model="limited"
            :max="3"
            unique
            :placeholder="t('example.doc.tagInput.sample.placeholder')"
            fluid
          />
          <TagInput v-model="limited" disabled />
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
