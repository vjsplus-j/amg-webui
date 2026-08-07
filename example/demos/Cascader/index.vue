<script setup lang="ts">
/**
 * Curated demo — Form wave1 Cascader
 */
import { computed, ref } from 'vue'
import { Cascader } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import type { CascaderOption } from '@amg-webui/form/Cascader/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const region = ref<unknown>(['east', 'sh'])
const empty = ref<unknown>(null)

const options = computed<CascaderOption[]>(() => [
  {
    label: t('example.doc.cascader.sample.regionA'),
    value: 'east',
    children: [
      { label: t('example.doc.cascader.sample.citySh'), value: 'sh' },
      { label: t('example.doc.cascader.sample.cityHz'), value: 'hz' }
    ]
  },
  {
    label: t('example.doc.cascader.sample.regionB'),
    value: 'south',
    children: [{ label: t('example.doc.cascader.sample.cityGz'), value: 'gz' }]
  }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { Cascader } from '@amg-webui/form'`
  ],
  script: [
    `const region = ref(['east', 'sh'])`,
    `const options = computed(() => [/* region tree */])`
  ],
  template: [
    `  <Cascader`,
    `    v-model="region"`,
    `    :options="options"`,
    `    :placeholder="t('example.doc.cascader.sample.placeholder')"`,
    `  />`
  ]
})

const codeDisabled = demoCode(
  `<Cascader`,
  `  v-model="empty"`,
  `  :options="options"`,
  `  :placeholder="t('example.doc.cascader.sample.placeholder')"`,
  `/>`,
  `<Cascader v-model="region" :options="options" disabled />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.cascader.prop.modelValue'),
    type: 'unknown',
    defaultValue: '—'
  },
  {
    name: 'options',
    description: t('example.doc.cascader.prop.options'),
    type: 'CascaderOption[]',
    defaultValue: '[]'
  },
  {
    name: 'placeholder',
    description: t('example.doc.cascader.prop.placeholder'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'disabled',
    description: t('example.doc.cascader.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.cascader.event.change'),
    type: '(value: unknown) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.cascader.demo.basic')"
      :description="t('example.doc.cascader.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Cascader
          v-model="region"
          :options="options"
          :placeholder="t('example.doc.cascader.sample.placeholder')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.cascader.demo.disabled')"
      :description="t('example.doc.cascader.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-curated__row">
        <Space>
          <Cascader
            v-model="empty"
            :options="options"
            :placeholder="t('example.doc.cascader.sample.placeholder')"
          />
          <Cascader v-model="region" :options="options" disabled />
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
