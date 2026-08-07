<script setup lang="ts">
/**
 * Curated demo — Form wave1 FormGroup
 */
import { computed, reactive, ref } from 'vue'
import { Form, FormGroup, FormItem, InputText } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const collapsed = ref(false)

const model = reactive({
  nickname: '',
  note: ''
})

const codeCollapsible = demoSfc({
  imports: [
    `import { ref, reactive } from 'vue'`,
    `import { FormGroup, Form, FormItem, InputText } from '@amg-webui/form'`
  ],
  script: [
    `const collapsed = ref(false)`,
    `const model = reactive({ nickname: '' })`
  ],
  template: [
    `  <FormGroup`,
    `    v-model:collapsed="collapsed"`,
    `    :title="t('example.doc.formGroup.sample.sectionTitle')"`,
    `  >`,
    `    <Form :model="model" label-position="top">`,
    `      <FormItem :label="t('example.doc.formGroup.sample.fieldLabel')">`,
    `        <InputText v-model="model.nickname" />`,
    `      </FormItem>`,
    `    </Form>`,
    `  </FormGroup>`
  ]
})

const codeNested = demoCode(
  `<FormGroup :title="t('example.doc.formGroup.sample.detailsTitle')" :collapsible="false">`,
  `  <FormItem :label="t('example.doc.formGroup.sample.noteLabel')">`,
  `    <InputText v-model="model.note" />`,
  `  </FormItem>`,
  `</FormGroup>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'title',
    description: t('example.doc.formGroup.prop.title'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'collapsible',
    description: t('example.doc.formGroup.prop.collapsible'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'collapsed',
    description: t('example.doc.formGroup.prop.collapsed'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'disabled',
    description: t('example.doc.formGroup.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:collapsed / toggle',
    description: t('example.doc.formGroup.event.toggle'),
    type: '(collapsed: boolean) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.formGroup.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'extra',
    description: t('example.doc.formGroup.slot.extra'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.formGroup.demo.collapsible')"
      :description="t('example.doc.formGroup.demo.collapsibleDesc')"
      :code="codeCollapsible"
      default-open
    >
      <FormGroup
        v-model:collapsed="collapsed"
        :title="t('example.doc.formGroup.sample.sectionTitle')"
      >
        <Form :model="model" label-position="top">
          <FormItem :label="t('example.doc.formGroup.sample.fieldLabel')">
            <InputText
              v-model="model.nickname"
              :placeholder="t('example.doc.formGroup.sample.fieldPlaceholder')"
            />
          </FormItem>
        </Form>
      </FormGroup>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.formGroup.demo.nested')"
      :description="t('example.doc.formGroup.demo.nestedDesc')"
      :code="codeNested"
    >
      <FormGroup
        :title="t('example.doc.formGroup.sample.detailsTitle')"
        :collapsible="false"
      >
        <Form :model="model" label-position="top">
          <FormItem :label="t('example.doc.formGroup.sample.noteLabel')">
            <InputText
              v-model="model.note"
              :placeholder="t('example.doc.formGroup.sample.notePlaceholder')"
            />
          </FormItem>
        </Form>
      </FormGroup>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
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
