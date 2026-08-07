<script setup lang="ts">
/**
 * Curated demo — Form wave1 InputText
 */
import { ref } from 'vue'
import { InputText } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode } from '../../components/demo/demoCode'
import Basic from '@amg-webui/demos/input-text/Basic.vue'
import basicSource from '@amg-webui/demos/input-text/Basic.vue?raw'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const limited = ref('')
const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']
const sizeVals = ref<Record<Size, string>>({
  xs: '',
  sm: '',
  md: '',
  lg: '',
  xl: ''
})

const codeSize = demoCode(
  `<InputText v-model="xs" size="xs" :placeholder="t('example.doc.inputText.sample.placeholder')" />`,
  `<InputText v-model="sm" size="sm" :placeholder="t('example.doc.inputText.sample.placeholder')" />`,
  `<InputText v-model="md" size="md" :placeholder="t('example.doc.inputText.sample.placeholder')" />`,
  `<InputText v-model="lg" size="lg" :placeholder="t('example.doc.inputText.sample.placeholder')" />`,
  `<InputText v-model="xl" size="xl" :placeholder="t('example.doc.inputText.sample.placeholder')" />`
)

const codeLimit = demoCode(
  `<InputText`,
  `  v-model="limited"`,
  `  :maxlength="20"`,
  `  :placeholder="t('example.doc.inputText.sample.placeholder')"`,
  `  fluid`,
  `/>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.inputText.demo.basic')"
      :description="t('example.doc.inputText.demo.basicDesc')"
      :code="basicSource"
      default-open
    >
      <Basic />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.inputText.demo.size')"
      :description="t('example.doc.inputText.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-curated__row">
        <Space>
          <InputText
            v-for="sz in sizes"
            :key="sz"
            v-model="sizeVals[sz]"
            :size="sz"
            :placeholder="t('example.doc.inputText.sample.placeholder')"
          />
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.inputText.demo.limit')"
      :description="t('example.doc.inputText.demo.limitDesc')"
      :code="codeLimit"
    >
      <div class="vp-curated__row">
        <InputText
          v-model="limited"
          :maxlength="20"
          fluid
          :placeholder="t('example.doc.inputText.sample.placeholder')"
        />
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
