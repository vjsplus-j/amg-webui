<script setup lang="ts">
/**
 * Curated demo — Form wave1 FormTabs
 */
import { computed, ref } from 'vue'
import { FormTabs } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
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

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.formTabs.prop.modelValue'),
    type: 'string | number',
    defaultValue: '—'
  },
  {
    name: 'tabs / tabData',
    description: t('example.doc.formTabs.prop.tabs'),
    type: 'FormTabItem[] / Record<string, Record>',
    defaultValue: '[] / {}'
  },
  {
    name: 'fieldLabels / rules',
    description: t('example.doc.formTabs.prop.fieldLabels'),
    type: 'Record / FormRules',
    defaultValue: '{} / —'
  },
  {
    name: 'disabled',
    description: t('example.doc.formTabs.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.formTabs.event.change'),
    type: '(name: string | number) => void',
    defaultValue: '-'
  },
  {
    name: 'update:tabData',
    description: t('example.doc.formTabs.event.tabData'),
    type: '(value: Record<string, Record>) => void',
    defaultValue: '-'
  }
])
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
