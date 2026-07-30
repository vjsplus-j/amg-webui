<script setup lang="ts">
/**
 * Curated demo — Form wave1 Password
 */
import { computed, ref } from 'vue'
import { Password, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const secret = ref('')
const hidden = ref('amg-webui')

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Password } from '@amg-webui/components/base'`
  ],
  script: [`const secret = ref('')`],
  template: [
    `  <Password`,
    `    v-model="secret"`,
    `    show-toggle`,
    `    :placeholder="t('example.doc.password.sample.placeholder')"`,
    `  />`
  ]
})

const codeToggle = demoCode(
  `<Password v-model="hidden" show-toggle />`,
  `<Password v-model="hidden" disabled />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.password.prop.modelValue'),
    type: 'string',
    defaultValue: "''"
  },
  {
    name: 'showToggle',
    description: t('example.doc.password.prop.showToggle'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'placeholder / size',
    description: t('example.doc.password.prop.placeholder'),
    type: 'string / Size',
    defaultValue: '— / md'
  },
  {
    name: 'disabled / invalid',
    description: t('example.doc.password.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue',
    description: t('example.doc.password.event.change'),
    type: '(value: string) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.password.demo.basic')"
      :description="t('example.doc.password.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Password
          v-model="secret"
          show-toggle
          fluid
          :placeholder="t('example.doc.password.sample.placeholder')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.password.demo.toggle')"
      :description="t('example.doc.password.demo.toggleDesc')"
      :code="codeToggle"
    >
      <div class="vp-curated__row">
        <Space>
          <Password v-model="hidden" show-toggle />
          <Password v-model="hidden" disabled />
        </Space>
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
