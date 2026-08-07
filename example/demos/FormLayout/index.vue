<script setup lang="ts">
import { computed, ref } from 'vue'
import { FormLayout, Button, Space } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import type { FormLayoutColumns, FormLayoutMode } from '@amg-webui/core/FormLayout'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const layout = ref<FormLayoutMode>('horizontal')
const columns = ref<FormLayoutColumns>(1)
const colon = ref(false)
const labelWidth = ref<'sm' | 'md' | 'lg'>('md')
const name = ref('')
const mail = ref('')
const phone = ref('')
const city = ref('')

const codeBasic = demoSfc({
  imports: [`import { FormLayout } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'`],
  template: [
    '  <FormLayout layout="horizontal" :colon="true" columns="2">',
    '    <div class="vp-form-layout__row">',
    `      <label class="vp-form-layout__label">{{ t('example.doc.formLayout.sample.name') }}</label>`,
    '      <div class="vp-form-layout__control"><InputText /></div>',
    '    </div>',
    '  </FormLayout>'
  ]
})

const codeInline = demoCode(
  `<FormLayout layout="inline" gap="md">`,
  `  <div class="vp-form-layout__row">…</div>`,
  `</FormLayout>`
)

const propRows = computed<PropRow[]>(() => [
  { name: 'layout', type: "'horizontal'|'vertical'|'inline'", defaultValue: "'horizontal'", description: t('example.doc.formLayout.prop.layout') },
  { name: 'columns', type: '1 | 2 | 3', defaultValue: '1', description: t('example.doc.formLayout.prop.columns') },
  { name: 'colon', type: 'boolean', defaultValue: 'false', description: t('example.doc.formLayout.prop.colon') },
  { name: 'labelWidth', type: "'sm'|'md'|'lg'|'auto'", defaultValue: "'md'", description: t('example.doc.formLayout.prop.labelWidth') },
  { name: 'gap', type: "'sm'|'md'|'lg'", defaultValue: "'md'", description: t('example.doc.formLayout.prop.gap') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.formLayout.when') }}</p>

    <DemoBlock
      :title="t('example.doc.formLayout.demo.modes')"
      :description="t('example.doc.formLayout.demo.modesDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <div class="vp-curated__toolbar">
          <span class="vp-curated__hint">{{ t('example.doc.formLayout.demo.layoutLabel') }}</span>
          <Space wrap>
            <Button
              v-for="mode in (['horizontal', 'vertical', 'inline'] as const)"
              :key="mode"
              size="sm"
              :variant="layout === mode ? 'solid' : 'outlined'"
              @click="layout = mode"
            >
              {{ t(`example.doc.formLayout.layout.${mode}`) }}
            </Button>
          </Space>
        </div>
        <div class="vp-curated__toolbar">
          <span class="vp-curated__hint">{{ t('example.doc.formLayout.demo.columnsLabel') }}</span>
          <Space wrap>
            <Button
              v-for="n in ([1, 2, 3] as const)"
              :key="n"
              size="sm"
              :variant="columns === n ? 'solid' : 'outlined'"
              :disabled="layout === 'inline'"
              @click="columns = n"
            >
              {{ t('example.doc.formLayout.columns.n', { n }) }}
            </Button>
          </Space>
        </div>
        <div class="vp-curated__toolbar">
          <Space wrap>
            <Button
              v-for="w in (['sm', 'md', 'lg'] as const)"
              :key="w"
              size="sm"
              :variant="labelWidth === w ? 'solid' : 'outlined'"
              :disabled="layout === 'vertical' || layout === 'inline'"
              @click="labelWidth = w"
            >
              {{ w }}
            </Button>
            <Button
              size="sm"
              :variant="colon ? 'solid' : 'outlined'"
              @click="colon = !colon"
            >
              {{ t('example.doc.formLayout.demo.colonToggle') }}
            </Button>
          </Space>
        </div>

        <FormLayout
          :layout="layout"
          :columns="columns"
          :colon="colon"
          :label-width="labelWidth"
        >
          <div class="vp-form-layout__row">
            <label class="vp-form-layout__label">{{ t('example.doc.formLayout.sample.name') }}</label>
            <div class="vp-form-layout__control">
              <InputText v-model="name" :placeholder="t('example.doc.formLayout.sample.namePh')" />
            </div>
          </div>
          <div class="vp-form-layout__row">
            <label class="vp-form-layout__label">{{ t('example.doc.formLayout.sample.mail') }}</label>
            <div class="vp-form-layout__control">
              <InputText v-model="mail" :placeholder="t('example.doc.formLayout.sample.mailPh')" />
            </div>
          </div>
          <div class="vp-form-layout__row">
            <label class="vp-form-layout__label">{{ t('example.doc.formLayout.sample.phone') }}</label>
            <div class="vp-form-layout__control">
              <InputText v-model="phone" :placeholder="t('example.doc.formLayout.sample.phonePh')" />
            </div>
          </div>
          <div class="vp-form-layout__row">
            <label class="vp-form-layout__label">{{ t('example.doc.formLayout.sample.city') }}</label>
            <div class="vp-form-layout__control">
              <InputText v-model="city" :placeholder="t('example.doc.formLayout.sample.cityPh')" />
            </div>
          </div>
        </FormLayout>

        <p v-if="name || mail || phone || city" class="vp-curated__hint">
          {{ t('example.doc.formLayout.sample.echoFull', { name: name || '—', mail: mail || '—', phone: phone || '—', city: city || '—' }) }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.formLayout.demo.inline')"
      :description="t('example.doc.formLayout.demo.inlineDesc')"
      :code="codeInline"
    >
      <FormLayout layout="inline" gap="md">
        <div class="vp-form-layout__row">
          <label class="vp-form-layout__label">{{ t('example.doc.formLayout.sample.name') }}</label>
          <div class="vp-form-layout__control">
            <InputText v-model="name" :placeholder="t('example.doc.formLayout.sample.namePh')" />
          </div>
        </div>
        <div class="vp-form-layout__row">
          <label class="vp-form-layout__label">{{ t('example.doc.formLayout.sample.mail') }}</label>
          <div class="vp-form-layout__control">
            <InputText v-model="mail" :placeholder="t('example.doc.formLayout.sample.mailPh')" />
          </div>
        </div>
      </FormLayout>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
    </section>
  </div>
</template>

<style scoped>
.vp-curated__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
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
