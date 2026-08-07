<script setup lang="ts">
/**
 * Curated demo — Form wave1 Switch
 */
import { computed, ref } from 'vue'
import { Switch } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
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

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.switch.prop.modelValue'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'size',
    description: t('example.doc.switch.prop.size'),
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
    defaultValue: "'md'"
  },
  {
    name: 'disabled / loading',
    description: t('example.doc.switch.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'inlinePrompt',
    description: t('example.doc.switch.prop.inlinePrompt'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'activeText / inactiveText',
    description: t('example.doc.switch.prop.texts'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'ariaLabel',
    description: t('example.doc.switch.prop.ariaLabel'),
    type: 'string',
    defaultValue: '—'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.switch.event.change'),
    type: '(value: boolean) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.switch.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  }
])
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
