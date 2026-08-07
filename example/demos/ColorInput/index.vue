<script setup lang="ts">
import { computed, ref } from 'vue'
import { ColorInput } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const color = ref('#3B82F6')
const disabledColor = ref('#10B981')
const smColor = ref('#6366F1')

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { ColorInput } from '@amg-webui/form'`
  ],
  script: [`const color = ref('#3B82F6')`],
  template: [`  <ColorInput v-model="color" />`]
})

const codeDisabled = demoCode(`<ColorInput v-model="disabledColor" disabled />`)

const codeSize = demoCode(
  `<ColorInput v-model="smColor" size="sm" />`,
  `<ColorInput v-model="color" size="lg" />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.colorInput.prop.modelValue'),
    type: 'string',
    defaultValue: "''"
  },
  {
    name: 'size',
    description: t('example.doc.colorInput.prop.size'),
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
    defaultValue: "'md'"
  },
  {
    name: 'disabled',
    description: t('example.doc.colorInput.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.colorInput.event.change'),
    type: '(value: string) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.colorInput.demo.basic')"
      :description="t('example.doc.colorInput.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <ColorInput v-model="color" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.colorInput.demo.disabled')"
      :description="t('example.doc.colorInput.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-curated__row">
        <ColorInput v-model="disabledColor" disabled />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.colorInput.demo.size')"
      :description="t('example.doc.colorInput.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-curated__row">
        <ColorInput v-model="smColor" size="sm" />
        <ColorInput v-model="color" size="lg" />
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
