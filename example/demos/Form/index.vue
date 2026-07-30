<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  Form,
  FormItem,
  FormGroup,
  FormTabs,
  InputText,
  Button,
  StatusTip
} from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const submitOk = ref(false)
const submitFail = ref(false)

const model = reactive({
  username: '',
  email: ''
})

const rules = computed(() => ({
  username: [
    { required: true, message: t(LocaleKeys.error.required) },
    { min: 3, message: t(LocaleKeys.error.minLength, { min: 3 }) }
  ],
  email: [
    { required: true, message: t(LocaleKeys.error.required) },
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: t(LocaleKeys.error.invalidEmail)
    }
  ]
}))

const groupCollapsed = ref(false)

const tabs = computed(() => [
  { name: 'basic', label: t('example.doc.form.sample.tabBasic') },
  { name: 'extra', label: t('example.doc.form.sample.tabExtra') }
])

const tabData = ref<Record<string, Record<string, unknown>>>({
  basic: { nickname: 'Ada' },
  extra: { note: 'AMG' }
})

const fieldLabels = computed(() => ({
  basic: { nickname: t('example.doc.form.sample.nickname') },
  extra: { note: t('example.doc.form.sample.note') }
}))

/** Form emits validate on every submit attempt; submit only when valid. */
function onValidate(valid: boolean) {
  submitOk.value = valid
  submitFail.value = !valid
}

const codeBasic = demoSfc({
  imports: [`import { Form, FormItem, InputText, Button } from '@amg-webui/components/base'`],
  template: [
    '  <Form :model="model" :rules="rules" @validate="onValidate">',
    `    <FormItem :label="t('example.doc.form.sample.username')" prop="username">`,
    '      <InputText v-model="model.username" />',
    '    </FormItem>',
    '    <Button type="submit">{{ t(\'button.submit\') }}</Button>',
    '  </Form>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'model / rules',
    type: 'object',
    defaultValue: '-',
    description: t('example.doc.form.prop.model')
  },
  {
    name: 'labelPosition',
    type: "'left' | 'top'",
    defaultValue: 'left',
    description: t('example.doc.form.prop.labelPosition')
  },
  {
    name: 'labelWidth',
    type: 'string',
    defaultValue: '-',
    description: t('example.doc.form.prop.labelWidth')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.form.when') }}</p>

    <DemoBlock
      :title="t('example.doc.form.demo.validate')"
      :description="t('example.doc.form.demo.validateDesc')"
      :code="codeBasic"
    >
      <div class="vp-curated__stack">
        <Form
          :model="model"
          :rules="rules"
          label-width="6rem"
          @validate="onValidate"
        >
          <FormItem :label="t('example.doc.form.sample.username')" prop="username">
            <InputText v-model="model.username" />
          </FormItem>
          <FormItem :label="t('example.doc.form.sample.email')" prop="email">
            <InputText v-model="model.email" />
          </FormItem>
          <div class="vp-curated__row">
            <Button type="submit" variant="solid" severity="primary" size="sm">
              {{ t(LocaleKeys.button.submit) }}
            </Button>
          </div>
        </Form>
        <StatusTip v-if="submitOk" severity="success" :message="t('example.doc.form.sample.ok')" />
        <StatusTip v-if="submitFail" severity="danger" :message="t('example.doc.form.sample.fail')" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.form.demo.group')"
      :description="t('example.doc.form.demo.groupDesc')"
      :code="codeBasic"
    >
      <FormGroup v-model:collapsed="groupCollapsed" :title="t('example.doc.form.sample.group')">
        <Form :model="model" label-position="top">
          <FormItem :label="t('example.doc.form.sample.username')">
            <InputText v-model="model.username" />
          </FormItem>
        </Form>
      </FormGroup>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.form.demo.tabs')"
      :description="t('example.doc.form.demo.tabsDesc')"
      :code="codeBasic"
    >
      <FormTabs v-model:tab-data="tabData" :tabs="tabs" :field-labels="fieldLabels" />
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-curated__stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}
.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  width: 100%;
}
</style>
