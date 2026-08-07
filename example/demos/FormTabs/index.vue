<script setup lang="ts">
/**
 * Curated demo — Form wave1 FormTabs
 */
import { ref, computed } from 'vue'
import { FormTabs } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const activeTab = ref<string | number>('profile')
const tabData = ref<Record<string, Record<string, unknown>>>({
  profile: { name: 'Alex Chen', email: 'alex@example.com' },
  security: { password: '' }
})

const tabs = computed(() => [
  { name: 'profile', label: t('example.doc.formTabs.sample.tabProfile') },
  { name: 'security', label: t('example.doc.formTabs.sample.tabSecurity') }
])

const fieldLabels = computed(() => ({
  profile: {
    name: t('biz.name'),
    email: t('biz.email')
  },
  security: {
    password: t('example.doc.formTabs.sample.fieldPassword')
  }
}))

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { FormTabs } from '@amg-webui/form'`
  ],
  script: [
    `const activeTab = ref('profile')`,
    `const tabData = ref({ profile: { name: '', email: '' }, security: { password: '' } })`,
    `const tabs = computed(() => [/* tab items */])`,
    `const fieldLabels = computed(() => ({ /* labels per tab */ }))`
  ],
  template: [
    `  <FormTabs`,
    `    v-model="activeTab"`,
    `    v-model:tab-data="tabData"`,
    `    :tabs="tabs"`,
    `    :field-labels="fieldLabels"`,
    `  />`
  ]
})

const codeDisabled = demoCode(
  `<FormTabs`,
  `  v-model="activeTab"`,
  `  v-model:tab-data="tabData"`,
  `  :tabs="tabs"`,
  `  :field-labels="fieldLabels"`,
  `  disabled`,
  `/>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.formTabs.demo.basic')"
      :description="t('example.doc.formTabs.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <FormTabs
          v-model="activeTab"
          v-model:tab-data="tabData"
          :tabs="tabs"
          :field-labels="fieldLabels"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.formTabs.demo.disabled')"
      :description="t('example.doc.formTabs.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-curated__row">
        <FormTabs
          v-model="activeTab"
          v-model:tab-data="tabData"
          :tabs="tabs"
          :field-labels="fieldLabels"
          disabled
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
