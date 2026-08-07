<script setup lang="ts">
/**
 * Curated demo — Form wave1 FormItem
 */
import { reactive, ref, computed } from 'vue'
import { Form, FormItem, InputText } from '@amg-webui/form'
import { Button, StatusTip } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const submitOk = ref(false)
const submitFail = ref(false)

const model = reactive({ name: '' })

const rules = computed(() => ({
  name: [{ required: true, message: t(LocaleKeys.error.required) }]
}))

function onValidate(valid: boolean) {
  submitOk.value = valid
  submitFail.value = !valid
}

const codeValidate = demoSfc({
  imports: [
    `import { reactive, computed } from 'vue'`,
    `import { Form, FormItem, InputText } from '@amg-webui/form'
import { Button } from '@amg-webui/core'`
  ],
  script: [
    `const model = reactive({ name: '' })`,
    `const rules = computed(() => ({`,
    `  name: [{ required: true, message: t('error.required') }]`,
    `}))`
  ],
  template: [
    `  <Form :model="model" :rules="rules" label-width="6rem">`,
    `    <FormItem :label="t('example.doc.formItem.sample.name')" prop="name">`,
    `      <InputText v-model="model.name" :placeholder="t('example.doc.formItem.sample.namePlaceholder')" />`,
    `    </FormItem>`,
    `    <Button type="submit">{{ t('button.submit') }}</Button>`,
    `  </Form>`
  ]
})

const codeRequired = demoCode(
  `<FormItem :label="t('example.doc.formItem.sample.email')" required>`,
  `  <InputText v-model="email" />`,
  `</FormItem>`
)

const email = ref('')
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.formItem.demo.validation')"
      :description="t('example.doc.formItem.demo.validationDesc')"
      :code="codeValidate"
      default-open
    >
      <div class="vp-curated__stack">
        <Form
          :model="model"
          :rules="rules"
          label-width="6rem"
          @validate="onValidate"
        >
          <FormItem :label="t('example.doc.formItem.sample.name')" prop="name">
            <InputText
              v-model="model.name"
              :placeholder="t('example.doc.formItem.sample.namePlaceholder')"
            />
          </FormItem>
          <div class="vp-curated__row">
            <Button type="submit" variant="solid" severity="primary" size="sm">
              {{ t(LocaleKeys.button.submit) }}
            </Button>
          </div>
        </Form>
        <StatusTip
          v-if="submitOk"
          severity="success"
          :message="t('example.doc.formItem.sample.ok')"
        />
        <StatusTip
          v-if="submitFail"
          severity="danger"
          :message="t('example.doc.formItem.sample.fail')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.formItem.demo.required')"
      :description="t('example.doc.formItem.demo.requiredDesc')"
      :code="codeRequired"
    >
      <Form label-width="6rem">
        <FormItem :label="t('example.doc.formItem.sample.email')" required>
          <InputText v-model="email" :placeholder="t('example.doc.formItem.sample.emailPlaceholder')" />
        </FormItem>
      </Form>
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  gap: var(--spacing-md);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
