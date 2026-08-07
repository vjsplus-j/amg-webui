<script setup lang="ts">
/**
 * Curated demo — Form wave1 Switch
 */
import { ref } from 'vue'
import { Switch } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const basic = ref(true)
const withPrompt = ref(false)
const loadingOn = ref(true)
const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']
const sizeVals = ref<Record<Size, boolean>>({
  xs: true,
  sm: true,
  md: false,
  lg: true,
  xl: false
})

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Switch } from '@amg-webui/form'`
  ],
  script: ['const on = ref(true)'],
  template: [`  <Switch v-model="on" />`, `  <Switch v-model="on" disabled />`]
})

const codeSize = demoCode(
  `<Switch v-model="xs" size="xs" />`,
  `<Switch v-model="sm" size="sm" />`,
  `<Switch v-model="md" size="md" />`,
  `<Switch v-model="lg" size="lg" />`,
  `<Switch v-model="xl" size="xl" />`
)

const codePrompt = demoCode(
  `<Switch`,
  `  v-model="withPrompt"`,
  `  inline-prompt`,
  `  :active-text="t('example.doc.switch.sample.on')"`,
  `  :inactive-text="t('example.doc.switch.sample.off')"`,
  `/>`
)

const codeLoading = demoCode(`<Switch v-model="loadingOn" loading />`)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.switch.demo.basic')"
      :description="t('example.doc.switch.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Space>
          <Switch v-model="basic" />
          <Switch v-model="basic" disabled />
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.switch.demo.size')"
      :description="t('example.doc.switch.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-curated__row">
        <Space>
          <Switch
            v-for="sz in sizes"
            :key="sz"
            v-model="sizeVals[sz]"
            :size="sz"
          />
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.switch.demo.prompt')"
      :description="t('example.doc.switch.demo.promptDesc')"
      :code="codePrompt"
    >
      <div class="vp-curated__row">
        <Switch
          v-model="withPrompt"
          inline-prompt
          :active-text="t('example.doc.switch.sample.on')"
          :inactive-text="t('example.doc.switch.sample.off')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.switch.demo.loading')"
      :description="t('example.doc.switch.demo.loadingDesc')"
      :code="codeLoading"
    >
      <div class="vp-curated__row">
        <Switch v-model="loadingOn" loading />
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
