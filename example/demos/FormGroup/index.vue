<script setup lang="ts">
/**
 * Curated demo — Form wave1 FormGroup
 */
import { reactive, ref } from 'vue'
import { Form, FormGroup, FormItem, InputText } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
  </div>
</template>

<style scoped lang="scss">
.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
